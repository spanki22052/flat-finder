import { Injectable, Logger } from '@nestjs/common';
import { BaseListingParser, ParsedListing } from './base.strategy.js';
import { randomDelay } from '../utils/delays.js';
import { randomUserAgent } from '../utils/user-agents.js';
import { createStealthContext, launchStealthBrowser } from '../utils/stealth.js';
import { ParserBlockedError, ParserInvalidPageError } from './cian.strategy.js';
import {
  extractInlineConfig, extractJsonLd, extractNextData, getNumber, getString,
  lightFetch, looksBlocked, normalizeCurrency,
} from '../utils/light-fetch.js';

@Injectable()
export class YandexRealtyParser extends BaseListingParser {
  readonly name = 'yandex';
  readonly hostnamePattern = /(^|\.)yandex\.ru$|(^|\.)realty\.yandex\.ru$/i;
  private readonly logger = new Logger(YandexRealtyParser.name);

  constructor() {
    super();
    (this as unknown as { parsePrice: typeof parsePrice }).parsePrice = parsePrice;
    (this as unknown as { findParamNumber: typeof findParamNumber }).findParamNumber = findParamNumber;
  }

  async parse(url: string): Promise<ParsedListing> {
    try {
      const light = await this.lightParse(url);
      if (light) {
        this.logger.log(`Yandex parsed via light-fetch: ${url}`);
        return light;
      }
    } catch (err) {
      if (err instanceof ParserBlockedError) throw err;
      this.logger.debug(`Yandex light-fetch failed: ${err instanceof Error ? err.message : err}`);
    }

    return this.heavyParse(url);
  }

  private async lightParse(url: string): Promise<ParsedListing | null> {
    const { html } = await lightFetch(url, {
      referer: 'https://realty.yandex.ru/',
      timeoutMs: 8000,
    });

    if (looksBlocked(html)) {
      this.logger.warn(`Yandex light-fetch detected block markers: ${url}`);
      throw new ParserBlockedError('Yandex: страница похожа на капчу/блокировку');
    }

    const ld = extractJsonLd(html);
    if (ld) {
      const mapped = this.mapJsonLd(ld, url);
      if (mapped) return mapped;
    }

    const inline = extractInlineConfig(html, ['__INITIAL_STATE__', '__NEXT_DATA__']);
    if (inline) {
      const mapped = this.mapYandexState(inline, url);
      if (mapped) return mapped;
    }
    const next = extractNextData(html);
    if (next) {
      const mapped = this.mapYandexState(next, url);
      if (mapped) return mapped;
    }

    return null;
  }

  private async heavyParse(url: string): Promise<ParsedListing> {
    const proxyUrl = process.env.PARSER_PROXY_URL;
    const browser = await launchStealthBrowser({
      headless: process.env.PARSER_HEADLESS !== 'false',
      ...(proxyUrl ? { proxyUrl } : {}),
      userAgent: randomUserAgent(),
    });

    try {
      const context = await createStealthContext(browser, {
        ...(proxyUrl ? { proxyUrl } : {}),
        userAgent: randomUserAgent(),
      });
      const page = await context.newPage();
      await page.setExtraHTTPHeaders({
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://realty.yandex.ru/',
      });

      this.logger.log(`Navigating to ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await randomDelay(2000, 4000);

      const html = await page.content();
      if (looksBlocked(html)) {
        throw new ParserBlockedError('Yandex: страница похожа на капчу/блокировку');
      }

      const inline = extractInlineConfig(html, ['__INITIAL_STATE__', '__NEXT_DATA__']);
      if (inline) {
        const mapped = this.mapYandexState(inline, url);
        if (mapped) return mapped;
      }
      const next = extractNextData(html);
      if (next) {
        const mapped = this.mapYandexState(next, url);
        if (mapped) return mapped;
      }
      const ld = extractJsonLd(html);
      if (ld) {
        const mapped = this.mapJsonLd(ld, url);
        if (mapped) return mapped;
      }

      return await this.extractFromDom(page, url);
    } finally {
      await browser.close();
    }
  }

  private mapJsonLd(data: Record<string, unknown>, sourceUrl: string): ParsedListing | null {
    const name = getString(data, ['name']);
    const address = data.address as Record<string, unknown> | undefined;
    const city = (address?.addressLocality as string | undefined) ?? null;
    const street = (address?.streetAddress as string | undefined);
    const priceSpec = Array.isArray(data.offers) ? data.offers[0] : (data.offers as Record<string, unknown> | undefined);
    const price = priceSpec && typeof priceSpec.price === 'number' ? priceSpec.price : null;
    const currency = priceSpec && typeof priceSpec.priceCurrency === 'string'
      ? priceSpec.priceCurrency.toUpperCase()
      : 'RUB';

    if (!name || !city || price == null) return null;

    return {
      source: 'LINK',
      sourceUrl,
      title: name,
      price,
      currency: normalizeCurrency(currency),
      city,
      address: street,
      description: typeof data.description === 'string' ? data.description : undefined,
    };
  }

  /**
   * Yandex хранит SSR-state в window.__INITIAL_STATE__.
   * Оффер лежит глубоко в state, ищем по типичным путям.
   */
  private mapYandexState(state: Record<string, unknown>, sourceUrl: string): ParsedListing | null {
    // Возможные корни с offer/offerCard
    const roots = [
      ['offer', 'data', 'offerCard'],
      ['offer', 'offerCard'],
      ['offerCard'],
      ['offer'],
      ['data', 'offer'],
      ['data', 'card'],
    ];
    for (const path of roots) {
      const offer = this.getByPath(state, path);
      if (offer && typeof offer === 'object') {
        const mapped = this.mapOffer(offer as Record<string, unknown>, sourceUrl);
        if (mapped) return mapped;
      }
    }
    const found = this.findFirstKey(state, ['offerCard', 'offer']);
    if (found && typeof found === 'object') {
      const mapped = this.mapOffer(found as Record<string, unknown>, sourceUrl);
      if (mapped) return mapped;
    }
    return null;
  }

  private mapOffer(offer: Record<string, unknown>, sourceUrl: string): ParsedListing | null {
    const title = getString(offer, ['title']) ?? getString(offer, ['name']);
    const price = getNumber(offer, ['price', 'value'])
      ?? getNumber(offer, ['price', 'amount'])
      ?? getNumber(offer, ['price']);
    const currency = getString(offer, ['price', 'currency']) ?? 'RUB';

    const city = getString(offer, ['geo', 'city', 'name'])
      ?? getString(offer, ['location', 'city', 'name'])
      ?? getString(offer, ['address', 'city', 'name'])
      ?? getString(offer, ['city', 'name'])
      ?? getString(offer, ['city']);

    const address = getString(offer, ['geo', 'address'])
      ?? getString(offer, ['address', 'full'])
      ?? getString(offer, ['address']);

    const description = getString(offer, ['description']);

    const rooms = getNumber(offer, ['rooms', 'count'])
      ?? getNumber(offer, ['roomsOffered'])
      ?? getNumber(offer, ['roomsTotal']);
    const area = getNumber(offer, ['area', 'value'])
      ?? getNumber(offer, ['area']);
    const floor = getNumber(offer, ['floor', 'value']) ?? getNumber(offer, ['floor']);
    const totalFloors = getNumber(offer, ['floorsOffered']) ?? getNumber(offer, ['floorsTotal']);

    if (!title || price == null || !city) return null;

    return {
      source: 'LINK',
      sourceUrl,
      title,
      price,
      currency: normalizeCurrency(currency),
      city,
      ...(address ? { address } : {}),
      ...(description ? { description } : {}),
      ...(rooms !== undefined ? { rooms } : {}),
      ...(area !== undefined ? { area } : {}),
      ...(floor !== undefined ? { floor } : {}),
      ...(totalFloors !== undefined ? { totalFloors } : {}),
    };
  }

  private getByPath(obj: unknown, path: string[]): unknown {
    let cur: unknown = obj;
    for (const key of path) {
      if (cur == null || typeof cur !== 'object') return undefined;
      cur = (cur as Record<string, unknown>)[key];
    }
    return cur;
  }

  private findFirstKey(obj: unknown, keys: string[], depth = 0): unknown {
    if (depth > 6) return null;
    if (!obj || typeof obj !== 'object') return null;
    for (const k of keys) {
      if (k in (obj as Record<string, unknown>)) {
        const v = (obj as Record<string, unknown>)[k];
        if (v && typeof v === 'object') return v;
      }
    }
    for (const v of Object.values(obj as Record<string, unknown>)) {
      if (v && typeof v === 'object') {
        const found = this.findFirstKey(v, keys, depth + 1);
        if (found) return found;
      }
    }
    return null;
  }

  // ─── DOM fallback ───────────────────────────────────────────────────────
  private async extractFromDom(page: import('playwright').Page, sourceUrl: string): Promise<ParsedListing> {
    const data = await page.evaluate(() => {
      const titleEl = document.querySelector<HTMLElement>('[data-testid="offer-title"]')
        ?? document.querySelector<HTMLElement>('h1');
      const title = titleEl?.textContent?.trim() ?? null;

      const priceEl = document.querySelector<HTMLElement>('[data-testid="offer-price"]')
        ?? document.querySelector<HTMLElement>('[data-testid="price"]');
      const priceText = priceEl?.textContent?.trim() ?? null;

      const addressEl = document.querySelector<HTMLElement>('[data-testid="address"]');
      const address = addressEl?.textContent?.trim() ?? null;

      const descEl = document.querySelector<HTMLElement>('[data-testid="description"]');
      const description = descEl?.textContent?.trim() ?? null;

      const photos = Array.from(document.querySelectorAll<HTMLImageElement>('[data-testid="gallery-image"] img, [data-testid="photo"] img'))
        .map((img) => img.currentSrc || img.src)
        .filter(Boolean);

      const paramRows = Array.from(document.querySelectorAll<HTMLElement>('[data-testid="item-pm"]'))
        .map((row) => row.textContent?.trim() ?? '')
        .filter(Boolean);

      return { title, priceText, address, description, photos, paramRows };
    });

    const price = parsePrice(data.priceText);
    const city = data.address?.split(',')[0]?.trim() ?? null;

    const rooms = findParamNumber(data.paramRows, /(\d+)\s*-?\s*к/i);
    const area = findParamNumber(data.paramRows, /(\d+(?:[.,]\d+)?)\s*м/i);
    const floor = findParamNumber(data.paramRows, /этаж\s*(\d+)/i);
    const totalFloors = findParamNumber(data.paramRows, /из\s*(\d+)/i);

    if (!data.title || price == null || !city) {
      throw new ParserInvalidPageError('Yandex: не удалось разобрать страницу');
    }

    return {
      source: 'LINK',
      sourceUrl,
      title: data.title,
      price,
      currency: 'RUB',
      city,
      address: data.address ?? undefined,
      description: data.description ?? undefined,
      rooms,
      area,
      floor,
      totalFloors,
      photos: data.photos.length > 0 ? data.photos : undefined,
    };
  }
}

function parsePrice(text: string | null): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[^\d]/g, '');
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : null;
}

function findParamNumber(params: string[], re: RegExp): number | undefined {
  for (const p of params) {
    const m = p.match(re);
    if (m) {
      const n = parseFloat(m[1].replace(',', '.'));
      if (Number.isFinite(n)) return n;
    }
  }
  return undefined;
}