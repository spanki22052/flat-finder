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
export class AvitoParser extends BaseListingParser {
  readonly name = 'avito';
  readonly hostnamePattern = /(^|\.)avito\.ru$/i;
  private readonly logger = new Logger(AvitoParser.name);

  constructor() {
    super();
    // Публичные обёртки helpers для unit-тестов
    (this as unknown as { parsePrice: typeof parsePrice }).parsePrice = parsePrice;
    (this as unknown as { parseCity: typeof parseCity }).parseCity = parseCity;
    (this as unknown as { findParamNumber: typeof findParamNumber }).findParamNumber = findParamNumber;
    (this as unknown as { parseFloorFromParams: typeof parseFloorFromParams }).parseFloorFromParams = parseFloorFromParams;
  }

  async parse(url: string): Promise<ParsedListing> {
    // Шаг 1: лёгкий fetch
    try {
      const light = await this.lightParse(url);
      if (light) {
        this.logger.log(`Avito parsed via light-fetch: ${url}`);
        return light;
      }
    } catch (err) {
      if (err instanceof ParserBlockedError) throw err;
      this.logger.debug(`Avito light-fetch failed: ${err instanceof Error ? err.message : err}`);
    }

    // Шаг 2: Playwright + stealth
    return this.heavyParse(url);
  }

  private async lightParse(url: string): Promise<ParsedListing | null> {
    const { html } = await lightFetch(url, {
      referer: 'https://www.avito.ru/',
      timeoutMs: 8000,
    });

    if (looksBlocked(html)) {
      this.logger.warn(`Avito light-fetch detected block markers: ${url}`);
      throw new ParserBlockedError('Avito: страница похожа на капчу/блокировку');
    }

    // 1) JSON-LD
    const ld = extractJsonLd(html);
    if (ld) {
      const mapped = this.mapJsonLd(ld, url);
      if (mapped) return mapped;
    }

    // 2) window.__INITIAL_STATE__ / __NEXT_DATA__
    const inline = extractInlineConfig(html, ['__INITIAL_STATE__', '__NEXT_DATA__']);
    if (inline) {
      const mapped = this.mapAvitoState(inline, url);
      if (mapped) return mapped;
    }
    const next = extractNextData(html);
    if (next) {
      const mapped = this.mapAvitoState(next, url);
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
        Referer: 'https://www.avito.ru/',
      });

      this.logger.log(`Navigating to ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await randomDelay(2500, 4500);

      const html = await page.content();
      if (looksBlocked(html)) {
        throw new ParserBlockedError('Avito: страница похожа на капчу/блокировку');
      }

      // SSR-state обычно доступен после рендера
      const inline = extractInlineConfig(html, ['__INITIAL_STATE__', '__NEXT_DATA__']);
      if (inline) {
        const mapped = this.mapAvitoState(inline, url);
        if (mapped) return mapped;
      }
      const next = extractNextData(html);
      if (next) {
        const mapped = this.mapAvitoState(next, url);
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
    const city = (address?.addressLocality as string | undefined)
      ?? (address?.addressRegion as string | undefined)
      ?? null;
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
   * Avito хранит SSR-state в window.__INITIAL_STATE__.
   * Структура: { "item": { "id":..., "title":..., "price":{...}, "params": [...], "geo": {...} } }
   */
  private mapAvitoState(state: Record<string, unknown>, sourceUrl: string): ParsedListing | null {
    const item = state.item as Record<string, unknown> | undefined
      ?? (state.props as Record<string, unknown> | undefined)?.pageProps as Record<string, unknown> | undefined
      ?? (state.props as Record<string, unknown> | undefined)?.initialState as Record<string, unknown> | undefined;
    const offer = item ?? state;

    const title = getString(offer, ['title']) ?? getString(offer, ['name']);
    const price = getNumber(offer, ['price', 'value'])
      ?? getNumber(offer, ['price']);
    const currency = getString(offer, ['price', 'currency'])
      ?? getString(offer, ['currency'])
      ?? 'RUB';

    const city = getString(offer, ['geo', 'city', 'name'])
      ?? getString(offer, ['location', 'city', 'name'])
      ?? getString(offer, ['city', 'name'])
      ?? getString(offer, ['city']);

    const address = getString(offer, ['geo', 'address'])
      ?? getString(offer, ['location', 'address'])
      ?? getString(offer, ['address']);

    const description = getString(offer, ['description']);

    // params: массив вида [{name: "Этаж", value: "5"}, {name: "Количество комнат", value: "2"}]
    const params = offer.params;
    let rooms: number | undefined;
    let area: number | undefined;
    let floor: number | undefined;
    let totalFloors: number | undefined;
    if (Array.isArray(params)) {
      for (const p of params) {
        if (!p || typeof p !== 'object') continue;
        const name = getString(p, ['name'])?.toLowerCase() ?? '';
        const value = getString(p, ['value']) ?? '';
        if (name.includes('комнат')) rooms = parseInt(value, 10) || rooms;
        else if (name.includes('площад')) area = parseFloat(value.replace(',', '.')) || area;
        else if (name.includes('этаж')) {
          const m = value.match(/(\d+)\s*из\s*(\d+)/i) ?? value.match(/(\d+)\s*\/\s*(\d+)/);
          if (m) {
            floor = Number(m[1]);
            totalFloors = Number(m[2]);
          } else {
            floor = parseInt(value, 10) || floor;
          }
        }
      }
    }

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

  // ─── DOM fallback ───────────────────────────────────────────────────────
  private async extractFromDom(page: import('playwright').Page, sourceUrl: string): Promise<ParsedListing> {
    const data = await page.evaluate(() => {
      const titleEl = document.querySelector<HTMLElement>('[data-marker="item-view/title-info"]')
        ?? document.querySelector<HTMLElement>('h1');
      const title = titleEl?.textContent?.trim() ?? null;

      const priceEl = document.querySelector<HTMLElement>('[data-marker="item-view/item-price"]')
        ?? document.querySelector<HTMLElement>('[itemprop="price"]');
      const priceText = priceEl?.textContent?.trim() ?? null;

      const addressEl = document.querySelector<HTMLElement>('[data-marker="item-view/item-address"]')
        ?? document.querySelector<HTMLElement>('[itemprop="address"]');
      const address = addressEl?.textContent?.trim() ?? null;

      const cityEl = document.querySelector<HTMLElement>('[data-marker="item-view/item-location"]')
        ?? document.querySelector<HTMLElement>('.style-item-address__string-wtd61');
      const cityText = cityEl?.textContent?.trim() ?? null;

      const descEl = document.querySelector<HTMLElement>('[data-marker="item-view/item-description"]');
      const description = descEl?.textContent?.trim() ?? null;

      const paramsList = Array.from(document.querySelectorAll<HTMLElement>('[data-marker="item-view/item-params"] li, .params-paramsList__item-_2R3P'))
        .map((el) => el.textContent?.trim() ?? '')
        .filter(Boolean);

      const photos = Array.from(document.querySelectorAll<HTMLImageElement>('[data-marker="item-view/gallery"] img, [data-marker="image-frame/image"]'))
        .map((img) => img.currentSrc || img.src)
        .filter(Boolean);

      return { title, priceText, address, cityText, description, paramsList, photos };
    });

    const price = parsePrice(data.priceText);
    const city = parseCity(data.cityText, data.address);

    const rooms = findParamNumber(data.paramsList, /(\d+)\s*-?\s*к/i);
    const area = findParamNumber(data.paramsList, /(\d+(?:[.,]\d+)?)\s*м²/i);
    const { floor, totalFloors } = parseFloorFromParams(data.paramsList);

    if (!data.title || price == null || !city) {
      throw new ParserInvalidPageError('Avito: не удалось разобрать страницу (нет title/price/city)');
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

function parseCity(cityText: string | null, address: string | null): string | null {
  const src = cityText ?? address;
  if (!src) return null;
  return src.split(',')[0]?.trim() ?? null;
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

function parseFloorFromParams(params: string[]): { floor?: number; totalFloors?: number } {
  for (const p of params) {
    const m = p.match(/этаж\s*(\d+)\s*из\s*(\d+)/i);
    if (m) return { floor: Number(m[1]), totalFloors: Number(m[2]) };
    const m2 = p.match(/(\d+)\s*\/\s*(\d+)\s*этаж/i);
    if (m2) return { floor: Number(m2[1]), totalFloors: Number(m2[2]) };
  }
  return {};
}

// Публичные обёртки для unit-тестов
export const _avitoTestHelpers = { parsePrice, parseCity, findParamNumber, parseFloorFromParams };