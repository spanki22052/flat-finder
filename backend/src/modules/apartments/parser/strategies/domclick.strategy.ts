import { Injectable, Logger } from '@nestjs/common';
import { load } from 'cheerio';
import type { Currency } from '@prisma/client';
import { BaseListingParser, ParsedListing } from './base.strategy.js';
import { ParserBlockedError, ParserInvalidPageError } from './cian.strategy.js';
import {
  lightFetch,
  looksBlocked,
  normalizeCurrency,
  BLOCK_MARKERS,
} from '../utils/light-fetch.js';
import { extractPhones } from '../utils/phones.js';
import { randomDelay } from '../utils/delays.js';
import { randomUserAgent } from '../utils/user-agents.js';
import { createStealthContext, launchStealthBrowser } from '../utils/stealth.js';

const PHOTO_CDN = 'https://img.dmclk.ru';

@Injectable()
export class DomClickParser extends BaseListingParser {
  readonly name = 'domclick';
  /** Региональные поддомены: tyumen.domclick.ru, www.domclick.ru, … */
  readonly hostnamePattern = /(^|\.)domclick\.ru$|(^|\.)domclick\.com$/i;
  private readonly logger = new Logger(DomClickParser.name);

  async parse(url: string): Promise<ParsedListing> {
    // Шаг 1: лёгкий HTTP GET. На блоке/пустых данных — не сдаёмся, идём в браузер.
    try {
      const light = await this.lightParse(url);
      if (light) {
        this.logger.log(`DomClick parsed via light-fetch: ${url}`);
        return light;
      }
    } catch (err) {
      this.logger.debug(
        `DomClick light-fetch failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    // Шаг 2: скачать HTML через Playwright, потом распарсить тем же пайплайном
    return this.heavyParse(url);
  }

  private async lightParse(url: string): Promise<ParsedListing | null> {
    this.logger.log(`Fetching ${url}`);
    const { html } = await lightFetch(url, {
      referer: 'https://domclick.ru/',
      timeoutMs: 8000,
      extraHeaders: {
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
    });

    if (isDomclickBlocked(html)) {
      this.logger.warn(
        `DomClick light-fetch looks blocked (len=${html.length}, markers=${detectBlockMarkers(html).join(',')}), will try browser: ${url}`,
      );
      return null;
    }

    const result = this.parseHtml(html, url, { throwOnFail: false });
    if (!result) {
      this.logger.warn(`DomClick light-fetch got HTML but parsed nothing (len=${html.length}): ${url}`);
    }
    return result;
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
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://domclick.ru/',
      });

      this.logger.log(`DomClick browser download: ${url}`);
      // goto timeout must leave room for waitForFunction + parse within outer 25s budget
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 14000 });
      this.logger.log(`DomClick browser: domcontentloaded for ${url}`);

      // SSR-state is injected inline → available immediately after DOMContentLoaded.
      // waitForFunction is a safety net; short timeout so we don't blow the budget.
      try {
        await page.waitForFunction(
          () => {
            const w = window as unknown as { __SSR_STATE__?: { productCard?: unknown } };
            return Boolean(
              w.__SSR_STATE__?.productCard
              || document.querySelector('meta[property="og:title"]')
              || document.querySelector('h1'),
            );
          },
          { timeout: 6000 },
        );
      } catch {
        // OK — grab what we have
      }

      const html = await page.content();
      this.logger.log(`DomClick browser: got HTML len=${html.length}, blocked=${isDomclickBlocked(html)}`);

      if (isDomclickBlocked(html)) {
        throw new ParserBlockedError('DomClick: страница заблокирована');
      }

      const mapped = this.parseHtml(html, url, { throwOnFail: false });
      if (mapped) return mapped;

      throw new ParserInvalidPageError('DomClick: не удалось разобрать страницу после загрузки');
    } finally {
      await browser.close();
    }
  }

  /** Общий разбор уже скачанного HTML. */
  parseHtml(
    html: string,
    sourceUrl: string,
    opts: { throwOnFail: boolean },
  ): ParsedListing | null {
    const fromSsr = this.mapFromSsrState(html, sourceUrl);
    if (fromSsr) return fromSsr;

    const fromJsonLd = this.mapFromJsonLd(html, sourceUrl);
    if (fromJsonLd) return fromJsonLd;

    const fromMeta = this.mapFromMetaTags(html, sourceUrl);
    if (fromMeta) return fromMeta;

    try {
      return this.extractFromDom(load(html), sourceUrl);
    } catch (err) {
      if (opts.throwOnFail) throw err;
      return null;
    }
  }

  /**
   * Основной путь: window.__SSR_STATE__.productCard (SSR React-приложения DomClick).
   * В JSON встречаются литералы `undefined` — заменяем на null перед parse.
   */
  mapFromSsrState(html: string, sourceUrl: string): ParsedListing | null {
    const state = extractDomclickSsrState(html);
    if (!state) return null;

    const productCard = state.productCard as Record<string, unknown> | undefined;
    if (!productCard || typeof productCard !== 'object') return null;

    const priceInfo = (productCard.priceInfo ?? {}) as Record<string, unknown>;
    const objectInfo = (productCard.objectInfo ?? {}) as Record<string, unknown>;
    const address = (productCard.address ?? {}) as Record<string, unknown>;
    const house = (productCard.house ?? {}) as Record<string, unknown>;
    const houseInfo = (house.info ?? {}) as Record<string, unknown>;
    const original = (productCard.originalProduct ?? {}) as Record<string, unknown>;
    const seller = (productCard.seller ?? {}) as Record<string, unknown>;
    const agent = (seller.agent ?? {}) as Record<string, unknown>;

    const price = typeof priceInfo.price === 'number' ? priceInfo.price : null;
    const city = typeof address.locality === 'string' ? address.locality : null;
    if (price == null || !city) return null;

    const rooms = typeof objectInfo.rooms === 'number' ? objectInfo.rooms : undefined;
    const area = typeof objectInfo.area === 'number' ? objectInfo.area : undefined;
    const floor = typeof objectInfo.floor === 'number' ? objectInfo.floor : undefined;
    const totalFloors = typeof houseInfo.floors === 'number' ? houseInfo.floors : undefined;

    const description =
      (typeof objectInfo.description === 'string' && objectInfo.description)
      || (typeof original.description === 'string' ? original.description : undefined);

    const street =
      (typeof address.name === 'string' && address.name)
      || (typeof address.displayNameShort === 'string' ? address.displayNameShort : undefined);

    const district = extractDistrict(address);
    const title = buildTitle({ rooms, area, floor, totalFloors, street, city });
    const photos = normalizePhotos(productCard.photos);
    const phones = collectPhones(agent.phone, description);
    const currency = normalizeCurrency(
      typeof priceInfo.currency === 'string' ? priceInfo.currency : 'RUB',
    );

    return {
      source: 'LINK',
      sourceUrl,
      title,
      price,
      currency,
      city,
      ...(district ? { district } : {}),
      ...(street ? { address: street } : {}),
      ...(rooms !== undefined ? { rooms } : {}),
      ...(area !== undefined ? { area } : {}),
      ...(floor !== undefined ? { floor } : {}),
      ...(totalFloors !== undefined ? { totalFloors } : {}),
      ...(description ? { description } : {}),
      ...(photos.length > 0 ? { photos } : {}),
      ...(phones.length > 0 ? { phones } : {}),
    };
  }

  mapJsonLd(data: Record<string, unknown>, sourceUrl: string): ParsedListing | null {
    const name = typeof data.name === 'string' ? data.name : null;
    const address = data.address as Record<string, unknown> | undefined;
    const city = (address?.addressLocality as string | undefined) ?? null;
    const offers = Array.isArray(data.offers) ? data.offers[0] : (data.offers as Record<string, unknown> | undefined);
    const price = offers && typeof offers.price === 'number' ? offers.price : null;
    const currency = offers && typeof offers.priceCurrency === 'string'
      ? offers.priceCurrency.toUpperCase()
      : 'RUB';

    if (!name || !city || price == null) return null;

    const photos = this.extractPhotos(data);
    const description = typeof data.description === 'string' ? data.description : undefined;
    const phones = extractPhones(description);

    return {
      source: 'LINK',
      sourceUrl,
      title: name,
      price,
      currency: this.normalizeCurrency(currency),
      city,
      address: typeof address?.streetAddress === 'string' ? address.streetAddress : undefined,
      description,
      ...(photos ? { photos } : {}),
      ...(phones.length > 0 ? { phones } : {}),
    };
  }

  private mapFromJsonLd(html: string, sourceUrl: string): ParsedListing | null {
    const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match: RegExpExecArray | null;
    while ((match = re.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1]) as Record<string, unknown>;
        const t = data['@type'];
        const types = Array.isArray(t) ? t : t ? [t] : [];
        if (!types.some((x) => typeof x === 'string' && /Apartment|Residence|Product|Offer|House|Accommodation/i.test(x))) {
          continue;
        }
        const mapped = this.mapJsonLd(data, sourceUrl);
        if (mapped) return mapped;
      } catch {
        // skip
      }
    }
    return null;
  }

  mapFromMetaTags(html: string, sourceUrl: string): ParsedListing | null {
    const titleRaw = matchMeta(html, 'property="og:title"') ?? matchMeta(html, 'name="title"') ?? htmlTitle(html);
    const descRaw = matchMeta(html, 'property="og:description"') ?? matchMeta(html, 'name="description"') ?? '';
    const image = matchMeta(html, 'property="og:image"');
    const title = decodeEntities(titleRaw ?? '').trim();
    const description = decodeEntities(descRaw).trim();

    const priceMatch = title.match(/(\d[\d\s\u00A0]*)\s*(?:руб\.?|₽|RUB)/i)
      ?? description.match(/(\d[\d\s\u00A0]*)\s*(?:руб\.?|₽|RUB)/i);
    const price = priceMatch ? parsePrice(priceMatch[1]) : null;

    // "… по адресу Тюмень, Первомайская улица, 50, 3 этаж по цене …"
    const addrMatch = title.match(/по адресу\s+(.+?),\s*\d+\s*этаж/i)
      ?? title.match(/по адресу\s+(.+?)\s+по цене/i);
    const addrParts = (addrMatch?.[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const city = addrParts[0] || inferCityFromUrl(sourceUrl);
    const street = addrParts.length > 1 ? addrParts.slice(1).join(', ') : undefined;

    if (!title || price == null || !city) return null;

    const rooms = extractRooms(title);
    const area = extractArea(title);
    const floor = extractFloor(title);
    const phones = extractPhones(description);

    return {
      source: 'LINK',
      sourceUrl,
      title: title.replace(/\s*-\s*Домклик.*$/i, '').trim() || title,
      price,
      currency: 'RUB',
      city,
      ...(street ? { address: street } : {}),
      ...(rooms !== undefined ? { rooms } : {}),
      ...(area !== undefined ? { area } : {}),
      ...(floor !== undefined ? { floor } : {}),
      ...(description ? { description } : {}),
      ...(image ? { photos: [image] } : {}),
      ...(phones.length > 0 ? { phones } : {}),
    };
  }

  private extractPhotos(data: Record<string, unknown>): string[] | undefined {
    const img = data.image;
    if (typeof img === 'string') return [img];
    if (Array.isArray(img)) return img.filter((u): u is string => typeof u === 'string');
    return undefined;
  }

  extractFromDom($: ReturnType<typeof load>, sourceUrl: string): ParsedListing {
    const title = $('h1').first().text().trim() || $('[data-testid="object-title"]').first().text().trim() || '';
    const priceText = $('[data-testid="price-value"]').first().text().trim()
      || ($('[itemprop="price"]').attr('content') ?? '');
    const address = $('[data-testid="object-address"]').first().text().trim()
      || $('[itemprop="address"]').text().trim();
    const city = address.split(',')[0]?.trim() ?? '';

    const price = parsePrice(priceText);

    if (!title || price == null || !city) {
      throw new ParserInvalidPageError('DomClick: не удалось разобрать страницу');
    }

    return {
      source: 'LINK',
      sourceUrl,
      title,
      price,
      currency: 'RUB',
      city,
      address: address || undefined,
    };
  }

  private normalizeCurrency(c: string): Currency {
    return normalizeCurrency(c);
  }
}

/**
 * DomClick-specific block check.
 * Общий `looksBlocked` ловит слово `forbidden` даже в легитимных бандлах —
 * если уже есть productCard / og:title карточки, это не блок.
 */
export function isDomclickBlocked(html: string): boolean {
  const markers = detectBlockMarkers(html);
  if (markers.length === 0) return false;

  // Если есть маркеры блока, но также есть признаки рабочей карточки — считаем не блоком
  if (/window\.__SSR_STATE__/i.test(html) && /productCard/i.test(html)) return false;
  if (/property=["']og:title["']/i.test(html) && /domclick/i.test(html) && /\d[\d\s]*руб/i.test(html)) {
    return false;
  }
  return true;
}

export function detectBlockMarkers(html: string): string[] {
  const lower = html.toLowerCase();
  return BLOCK_MARKERS.filter((m) => lower.includes(m));
}

/** Достаёт JSON из `window.__SSR_STATE__ = …` (до следующего `window.__…`). */
export function extractDomclickSsrState(html: string): Record<string, unknown> | null {
  const marker = /window\.__SSR_STATE__\s*=\s*/;
  const m = marker.exec(html);
  if (!m) return null;

  const start = m.index + m[0].length;
  const nextWindow = html.indexOf('window.__', start);
  const endScript = html.indexOf('</script>', start);
  let end = html.length;
  if (nextWindow !== -1) end = Math.min(end, nextWindow);
  if (endScript !== -1) end = Math.min(end, endScript);

  let raw = html.slice(start, end).trim();
  if (raw.endsWith(';')) raw = raw.slice(0, -1).trim();
  // DomClick сериализует JS-объект, не строгий JSON: `undefined` → null
  raw = raw.replace(/\bundefined\b/g, 'null');

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object') return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
  return null;
}

function extractDistrict(address: Record<string, unknown>): string | undefined {
  const parents = address.parents;
  if (!Array.isArray(parents)) return undefined;
  for (const p of parents) {
    if (!p || typeof p !== 'object') continue;
    const parent = p as Record<string, unknown>;
    if (parent.kind === 'district' && typeof parent.name === 'string') return parent.name;
  }
  return undefined;
}

function buildTitle(opts: {
  rooms?: number;
  area?: number;
  floor?: number;
  totalFloors?: number;
  street?: string;
  city?: string;
}): string {
  const parts: string[] = [];
  if (opts.rooms !== undefined) {
    parts.push(opts.rooms === 0 ? 'Студия' : `${opts.rooms}-к квартира`);
  } else {
    parts.push('Квартира');
  }
  if (opts.area !== undefined) parts.push(`${opts.area} м²`);
  if (opts.floor !== undefined) {
    parts.push(
      opts.totalFloors !== undefined
        ? `${opts.floor}/${opts.totalFloors} эт.`
        : `${opts.floor} эт.`,
    );
  }
  return parts.join(', ');
}

function normalizePhotos(photos: unknown): string[] {
  if (!Array.isArray(photos)) return [];
  const out: string[] = [];
  for (const p of photos) {
    let url: string | undefined;
    if (typeof p === 'string') url = p;
    else if (p && typeof p === 'object' && typeof (p as { url?: unknown }).url === 'string') {
      url = (p as { url: string }).url;
    }
    if (!url) continue;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      out.push(url);
    } else if (url.startsWith('/')) {
      out.push(`${PHOTO_CDN}${url}`);
    } else {
      out.push(`${PHOTO_CDN}/${url}`);
    }
  }
  return out;
}

function collectPhones(agentPhone: unknown, description?: string): string[] {
  const fromDesc = extractPhones(description);
  if (typeof agentPhone === 'string' && agentPhone && !/\*/.test(agentPhone)) {
    const fromAgent = extractPhones(agentPhone);
    return Array.from(new Set([...fromAgent, ...fromDesc]));
  }
  return fromDesc;
}

function parsePrice(text: string | null | undefined): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[^\d]/g, '');
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : null;
}

function matchMeta(html: string, attr: string): string | null {
  const re = new RegExp(`<meta[^>]+${attr}[^>]+content=["']([^"']+)["'][^>]*>`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}[^>]*>`, 'i');
  return re.exec(html)?.[1] ?? re2.exec(html)?.[1] ?? null;
}

function htmlTitle(html: string): string | null {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return m ? m[1] : null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function inferCityFromUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const m = /^([a-z0-9-]+)\.domclick\.(ru|com)$/i.exec(host);
    if (!m) return null;
    const sub = m[1];
    if (sub === 'www' || sub === 'domclick') return null;
    const known: Record<string, string> = {
      tyumen: 'Тюмень',
      moscow: 'Москва',
      spb: 'Санкт-Петербург',
      ekaterinburg: 'Екатеринбург',
      novosibirsk: 'Новосибирск',
      kazan: 'Казань',
      krasnodar: 'Краснодар',
      sochi: 'Сочи',
      samara: 'Самара',
      ufa: 'Уфа',
      omck: 'Омск',
      omsk: 'Омск',
      chelyabinsk: 'Челябинск',
      perm: 'Пермь',
      voronezh: 'Воронеж',
      rostov: 'Ростов-на-Дону',
    };
    return known[sub] ?? null;
  } catch {
    return null;
  }
}

function extractRooms(text: string): number | undefined {
  const studio = /студи/i.test(text);
  if (studio) return 0;
  const m = /(\d+)\s*[-–]?\s*(?:комн|к\b)/i.exec(text);
  if (!m) return undefined;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : undefined;
}

function extractArea(text: string): number | undefined {
  const m = /(\d+(?:[.,]\d+)?)\s*м²/i.exec(text);
  if (!m) return undefined;
  const n = parseFloat(m[1].replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

function extractFloor(text: string): number | undefined {
  const m = /(\d+)\s*этаж/i.exec(text);
  if (!m) return undefined;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : undefined;
}
