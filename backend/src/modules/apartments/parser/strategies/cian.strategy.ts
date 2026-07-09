import { Injectable, Logger } from '@nestjs/common';
import { BaseListingParser, ParsedListing } from './base.strategy.js';
import { randomDelay } from '../utils/delays.js';
import { randomUserAgent } from '../utils/user-agents.js';
import { createStealthContext, launchStealthBrowser } from '../utils/stealth.js';
import {
  extractInlineConfig, extractJsonLd, extractNextData, getNumber, getString,
  lightFetch, looksBlocked, normalizeCurrency,
} from '../utils/light-fetch.js';
import {
  decodeEntities, extractAreaFromText, extractFloorFromTitle, extractRoomsFromText,
  htmlTitle, inferCityFromUrl, matchMeta, parsePriceFromText,
} from '../utils/meta-parse.js';
import { extractPhones } from '../utils/phones.js';

export class ParserBlockedError extends Error {
  constructor(message: string) { super(message); this.name = 'ParserBlockedError'; }
}
export class ParserInvalidPageError extends Error {
  constructor(message: string) { super(message); this.name = 'ParserInvalidPageError'; }
}

@Injectable()
export class CianParser extends BaseListingParser {
  readonly name = 'cian';
  readonly hostnamePattern = /(^|\.)cian\.ru$/i;
  private readonly logger = new Logger(CianParser.name);

  async parse(url: string): Promise<ParsedListing> {
    // Шаг 1: лёгкий fetch без браузера
    try {
      const light = await this.lightParse(url);
      if (light) {
        this.logger.log(`CIAN parsed via light-fetch: ${url}`);
        return light;
      }
    } catch (err) {
      if (err instanceof ParserBlockedError) throw err;
      this.logger.debug(`light-fetch failed for ${url}: ${err instanceof Error ? err.message : err}`);
    }

    // Шаг 2: fallback на Playwright + stealth
    return this.heavyParse(url);
  }

  // ─── Light-fetch ────────────────────────────────────────────────────────
  private async lightParse(url: string): Promise<ParsedListing | null> {
    const { html } = await lightFetch(url, {
      referer: 'https://www.cian.ru/',
      timeoutMs: 8000,
    });

    if (looksBlocked(html)) {
      this.logger.warn(`CIAN light-fetch detected block markers: ${url}`);
      throw new ParserBlockedError('CIAN: страница похожа на капчу/блокировку');
    }

    // 1) JSON-LD
    const ld = extractJsonLd(html);
    if (ld) {
      const mapped = this.mapJsonLd(ld, html, url);
      if (mapped) return mapped;
    }

    // 2) meta-теги og:* — для CIAN это самый надёжный источник
    const fromMeta = this.mapFromMetaTags(html, url);
    if (fromMeta) return fromMeta;

    // 3) window._cianConfig / cianConfig (SSR-state CIAN)
    const cianCfg = extractInlineConfig(html, ['_cianConfig', 'cianConfig', '__INITIAL_STATE__']);
    if (cianCfg) {
      const mapped = this.mapCianConfig(cianCfg, url);
      if (mapped) return mapped;
    }

    // 3) __NEXT_DATA__ (на случай если CIAN переедет на Next.js)
    const next = extractNextData(html);
    if (next) {
      const mapped = this.mapNextData(next, url);
      if (mapped) return mapped;
    }

    return null;
  }

  // ─── Heavy-fetch (Playwright) ───────────────────────────────────────────
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
        Referer: 'https://www.cian.ru/',
      });

      this.logger.log(`Navigating to ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await randomDelay(1500, 3000);

      const html = await page.content();
      if (looksBlocked(html)) {
        throw new ParserBlockedError('CIAN: страница похожа на капчу/блокировку');
      }

      // Снова пробуем SSR-state (после рендера он точно есть)
      const cianCfg = extractInlineConfig(html, ['_cianConfig', 'cianConfig', '__INITIAL_STATE__']);
      if (cianCfg) {
        const mapped = this.mapCianConfig(cianCfg, url);
        if (mapped) return mapped;
      }

      const ld = extractJsonLd(html);
      if (ld) {
        const mapped = this.mapJsonLd(ld, html, url);
        if (mapped) return mapped;
      }

      const fromMeta = this.mapFromMetaTags(html, url);
      if (fromMeta) return fromMeta;

      return await this.extractFromDom(page, url);
    } finally {
      await browser.close();
    }
  }

  // ─── Mappers ────────────────────────────────────────────────────────────
  /**
   * CIAN отдаёт schema.org/Product с вложенным Offer.
   * Гео/адрес/этаж могут быть в JSON-LD (address), og:* мета-тегах или в тексте.
   */
  private mapJsonLd(data: Record<string, unknown>, html: string, sourceUrl: string): ParsedListing | null {
    const name = getString(data, ['name']);
    if (!name) return null;

    const addressObj = data.address as Record<string, unknown> | undefined;
    const offer = Array.isArray(data.offers) ? data.offers[0] as Record<string, unknown> | undefined : data.offers as Record<string, unknown> | undefined;
    const price = offer && typeof offer.price === 'number' ? offer.price : null;
    const currency = offer && typeof offer.priceCurrency === 'string' ? offer.priceCurrency.toUpperCase() : 'RUB';

    const meta = this.parseMeta(html);

    let city = (addressObj?.addressLocality as string | undefined)
      ?? meta.cityFromDescription
      ?? null;
    let street = (addressObj?.streetAddress as string | undefined)
      ?? meta.streetFromDescription
      ?? undefined;
    let district = (addressObj?.addressRegion as string | undefined) ?? undefined;
    let address = street && district ? `${street}, ${district}` : (street ?? meta.addressFromDescription ?? undefined);

    let rooms = extractRoomsFromText(name) ?? extractRoomsFromText(meta.title);
    let area = extractAreaFromText(name) ?? extractAreaFromText(meta.title) ?? extractAreaFromText(meta.description);
    let floor = extractFloorFromTitle(meta.title)?.floor;
    let totalFloors = extractFloorFromTitle(meta.title)?.totalFloors;

    const photos = this.extractPhotos(data);

    if (!city) {
      // На последнем шаге попробуем по доменному региону URL
      city = inferCityFromUrl(sourceUrl) ?? 'Москва';
    }

    const description = typeof data.description === 'string' ? data.description : undefined;
    const phones = extractPhones(description);

    if (!name || price == null) return null;

    return {
      source: 'LINK',
      sourceUrl,
      title: name,
      price,
      currency: normalizeCurrency(currency),
      city,
      ...(district ? { district } : {}),
      ...(address ? { address } : {}),
      ...(description ? { description } : {}),
      ...(rooms !== undefined ? { rooms } : {}),
      ...(area !== undefined ? { area } : {}),
      ...(floor !== undefined ? { floor } : {}),
      ...(totalFloors !== undefined ? { totalFloors } : {}),
      ...(photos ? { photos } : {}),
      ...(phones.length > 0 ? { phones } : {}),
    };
  }

  /**
   * Парсит CIAN-страницу только по og:* и meta-тегам.
   * Работает даже если SSR-state и JSON-LD не подошли.
   */
  private mapFromMetaTags(html: string, sourceUrl: string): ParsedListing | null {
    const meta = this.parseMeta(html);
    const priceMatch = meta.title.match(/(\d[\d\s\u00A0]*)\s*(?:руб\.?|₽|RUB)\s*\/?\s*(?:мес\.?\/?)?/i)
      ?? meta.description.match(/(\d[\d\s\u00A0]*)\s*(?:руб\.?|₽|RUB)/i);
    const price = priceMatch ? parsePriceFromText(priceMatch[1]) : null;

    const title = meta.title || null;
    const city = meta.cityFromDescription ?? inferCityFromUrl(sourceUrl);
    if (!title || price == null || !city) return null;

    const floorInfo = extractFloorFromTitle(meta.title);
    const rooms = extractRoomsFromText(title);
    const area = extractAreaFromText(title);
    const phones = extractPhones(meta.description);

    return {
      source: 'LINK',
      sourceUrl,
      title,
      price,
      currency: 'RUB',
      city,
      ...(meta.streetFromDescription ? { address: meta.streetFromDescription } : {}),
      ...(rooms !== undefined ? { rooms } : {}),
      ...(area !== undefined ? { area } : {}),
      ...(floorInfo?.floor !== undefined ? { floor: floorInfo.floor } : {}),
      ...(floorInfo?.totalFloors !== undefined ? { totalFloors: floorInfo.totalFloors } : {}),
      ...(phones.length > 0 ? { phones } : {}),
    };
  }

  private parseMeta(html: string): {
    title: string;
    description: string;
    cityFromDescription: string | null;
    streetFromDescription: string | null;
    addressFromDescription: string | undefined;
  } {
    const ogTitle = matchMeta(html, 'property="og:title"') ?? matchMeta(html, 'name="title"');
    const ogDesc = matchMeta(html, 'property="og:description"')
      ?? matchMeta(html, 'name="description"');
    // Для извлечения площади/этажа приоритет — og:title (он компактный и формат стабильный),
    // <title> используем как fallback.
    const title = decodeEntities(ogTitle ?? htmlTitle(html) ?? '');
    const description = decodeEntities(ogDesc ?? '');

    // Адрес вида "Мельничная ул., 83к3, Тюмень, Тюменская область, Центральный, мкр. Малыгина (Центральный)"
    const parts = description.split(',').map((s) => s.trim()).filter(Boolean);
    let cityFromDescription: string | null = null;
    let streetFromDescription: string | null = null;
    for (const p of parts) {
      // Город: обычно второе слово после улицы, ищем по признаку
      if (!cityFromDescription && /^(Москва|Санкт-Петербург|Тюмень|Екатеринбург|Новосибирск|Казань|Краснодар|Сочи|Ростов-на-Дону|Самара|Уфа|Нижний Новгород|Воронеж|Волгоград|Красноярск|Омск|Челябинск|Иркутск|Барнаул|Кемерово|Томск|Пермь|Оренбург|Махачкала|Минск|Ташкент|Бишкек|Алматы|Астана|Брест|Гомель|Калининград|Киев|Харьков|Днепр|Запорожье|Одесса|Львов|Батуми|Тбилиси|Ереван)/i.test(p)) {
        cityFromDescription = p;
      }
      // Также Тюменская область содержит слово "область" — пропускаем как город
      if (!cityFromDescription && /область|край/i.test(p) === false) {
        // Попробуем: если в части есть "область/край" — не она, иначе может быть город
      }
      // Улица: признак - "ул.", "пр.", "наб.", "ш.", "пер."
      if (!streetFromDescription && /(?:ул\.|пр\.|наб\.|ш\.|пер\.|б-р|просп\.|проезд)/i.test(p)) {
        streetFromDescription = p;
      }
    }
    // Фоллбек: если город не нашли по списку — возьмём 2-ю или 3-ю часть
    if (!cityFromDescription && parts.length >= 2) {
      const candidate = parts[1] ?? parts[2];
      if (candidate && !/район|округ|область|край|мкр\.|м-н|мкр-|корп\.|корп /i.test(candidate)) {
        cityFromDescription = candidate;
      }
    }

    return {
      title: title.trim(),
      description: description.trim(),
      cityFromDescription,
      streetFromDescription,
      addressFromDescription: description.trim() || undefined,
    };
  }

  private mapNextData(data: Record<string, unknown>, sourceUrl: string): ParsedListing | null {
    // Ищем props.pageProps.offer или аналогичные пути
    const candidates = [
      ['props', 'pageProps', 'offer'],
      ['props', 'pageProps', 'initialState', 'offer'],
      ['props', 'pageProps', 'data', 'offer'],
    ];
    for (const path of candidates) {
      const offer = this.getByPath(data, path);
      if (offer && typeof offer === 'object') {
        const mapped = this.mapOfferLike(offer as Record<string, unknown>, sourceUrl);
        if (mapped) return mapped;
      }
    }
    return null;
  }

  /**
   * CIAN хранит полное состояние страницы в window._cianConfig.
   * Структура: { "cianConfig": { "flat": { ... }, "region": { ... } } }
   * или { "flat": { ... }, ... } — зависит от версии.
   */
  private mapCianConfig(data: Record<string, unknown>, sourceUrl: string): ParsedListing | null {
    // Возможные корни объекта с оффером
    const roots = [
      ['cianConfig', 'flat'],
      ['cianConfig', 'offer'],
      ['cianConfig', 'card'],
      ['flat'],
      ['offer'],
      ['card'],
    ];
    for (const path of roots) {
      const flat = this.getByPath(data, path);
      if (flat && typeof flat === 'object') {
        const mapped = this.mapOfferLike(flat as Record<string, unknown>, sourceUrl);
        if (mapped) return mapped;
      }
    }
    // fallback: поищем где-то глубже
    const flatAnywhere = this.findFirstKey(data, ['flat', 'offer', 'card']);
    if (flatAnywhere && typeof flatAnywhere === 'object') {
      const mapped = this.mapOfferLike(flatAnywhere as Record<string, unknown>, sourceUrl);
      if (mapped) return mapped;
    }
    return null;
  }

  private mapOfferLike(offer: Record<string, unknown>, sourceUrl: string): ParsedListing | null {
    // CIAN использует camelCase + кириллические заголовки
    const title = getString(offer, ['title'])
      ?? getString(offer, ['name'])
      ?? getString(offer, ['seoTitle']);

    const price = getNumber(offer, ['price', 'value'])
      ?? getNumber(offer, ['price'])
      ?? getNumber(offer, ['bargainTerms', 'price']);
    const currency = getString(offer, ['price', 'currency'])
      ?? getString(offer, ['currency'])
      ?? 'RUB';

    const city = getString(offer, ['geo', 'city', 'name'])
      ?? getString(offer, ['address', 'city', 'name'])
      ?? getString(offer, ['city', 'name'])
      ?? getString(offer, ['city'])
      ?? getString(offer, ['region', 'name']);

    const district = getString(offer, ['geo', 'district', 'name'])
      ?? getString(offer, ['address', 'district', 'name'])
      ?? getString(offer, ['district', 'name'])
      ?? getString(offer, ['district']);

    const street = getString(offer, ['geo', 'street', 'name'])
      ?? getString(offer, ['address', 'street'])
      ?? getString(offer, ['street'])
      ?? getString(offer, ['address']);

    const address = [street, district].filter(Boolean).join(', ') || street || district;

    const rooms = getNumber(offer, ['roomsCount'])
      ?? getNumber(offer, ['rooms', 'count']);
    const area = getNumber(offer, ['totalArea'])
      ?? getNumber(offer, ['area', 'value']);
    const floor = getNumber(offer, ['floorNumber']);
    const totalFloors = getNumber(offer, ['floorsCount']);

    const description = getString(offer, ['description'])
      ?? getString(offer, ['seoDescription']);

    const photos = this.extractPhotosFromOffer(offer);
    const phones = extractPhones(description);

    if (!title || price == null || !city) return null;

    return {
      source: 'LINK',
      sourceUrl,
      title,
      price,
      currency: normalizeCurrency(currency),
      city,
      ...(district ? { district } : {}),
      ...(address ? { address } : {}),
      ...(description ? { description } : {}),
      ...(rooms !== undefined ? { rooms } : {}),
      ...(area !== undefined ? { area } : {}),
      ...(floor !== undefined ? { floor } : {}),
      ...(totalFloors !== undefined ? { totalFloors } : {}),
      ...(photos ? { photos } : {}),
      ...(phones.length > 0 ? { phones } : {}),
    };
  }

  // ─── Helpers ────────────────────────────────────────────────────────────
  private extractPhotos(data: Record<string, unknown>): string[] | undefined {
    const img = data.image;
    if (typeof img === 'string') return [img];
    if (Array.isArray(img)) return img.filter((u): u is string => typeof u === 'string');
    return undefined;
  }

  private extractPhotosFromOffer(offer: Record<string, unknown>): string[] | undefined {
    const photos = offer.photos;
    if (Array.isArray(photos)) {
      const urls = photos
        .map((p) => {
          if (typeof p === 'string') return p;
          if (p && typeof p === 'object') {
            const u = (p as Record<string, unknown>).url ?? (p as Record<string, unknown>).fullUrl ?? (p as Record<string, unknown>).thumbnailUrl;
            return typeof u === 'string' ? u : null;
          }
          return null;
        })
        .filter((u): u is string => Boolean(u));
      if (urls.length > 0) return urls;
    }
    const gallery = offer.gallery;
    if (Array.isArray(gallery)) {
      const urls = gallery
        .map((g) => typeof g === 'string' ? g : (g && typeof g === 'object' ? (g as Record<string, unknown>).url : null))
        .filter((u): u is string => typeof u === 'string');
      if (urls.length > 0) return urls;
    }
    return undefined;
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
      const text = (sel: string) => document.querySelector(sel)?.textContent?.trim() ?? null;
      const allText = (sel: string) => Array.from(document.querySelectorAll(sel))
        .map((el) => el.textContent?.trim())
        .filter(Boolean);

      const title = text('[data-name="OfferTitle"]') ?? text('h1');
      const priceText = text('[data-name="PriceInfo"]') ?? text('[data-testid="price-amount"]');
      const address = text('[data-name="AddressContainer"]') ?? text('[data-testid="address"]');
      const city = text('[data-name="GeoLabel"]') ?? null;
      const description = text('[data-name="Description"]');
      const areaText = allText('[data-name="AreaInfo"]').join(' ');
      const floorText = allText('[data-name="FloorInfo"]').join(' ');
      const roomsText = text('[data-name="RoomsCount"]');

      const photos = Array.from(document.querySelectorAll<HTMLImageElement>('img[data-name="GalleryImage"], [data-name="Gallery"] img'))
        .map((img) => img.currentSrc || img.src)
        .filter(Boolean);

      return { title, priceText, city, address, description, areaText, floorText, roomsText, photos };
    });

    const price = parsePrice(data.priceText);
    const area = parseNumber(data.areaText);
    const rooms = parseNumber(data.roomsText);
    const { floor, totalFloors } = parseFloor(data.floorText);

    if (!data.title || price == null || !data.city) {
      throw new ParserInvalidPageError('CIAN: не удалось разобрать страницу (нет title/price/city)');
    }

    const phones = extractPhones(data.description);

    return {
      source: 'LINK',
      sourceUrl,
      title: data.title,
      price,
      currency: 'RUB',
      city: data.city,
      address: data.address ?? undefined,
      description: data.description ?? undefined,
      area,
      rooms,
      floor,
      totalFloors,
      photos: data.photos.length > 0 ? data.photos : undefined,
      ...(phones.length > 0 ? { phones } : {}),
    };
  }
}

function parsePrice(text: string | null): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[^\d.,]/g, '').replace(/\s/g, '');
  const num = parseFloat(cleaned.replace(',', '.'));
  return Number.isFinite(num) ? Math.round(num) : null;
}

function parseNumber(text: string | null | undefined): number | undefined {
  if (!text) return undefined;
  const m = text.match(/\d+(?:[.,]\d+)?/);
  if (!m) return undefined;
  const n = parseFloat(m[0].replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

function parseFloor(text: string | null | undefined): { floor?: number; totalFloors?: number } {
  if (!text) return {};
  const m = text.match(/(\d+)\s*\/\s*(\d+)/);
  if (!m) return { floor: parseNumber(text) };
  return { floor: Number(m[1]), totalFloors: Number(m[2]) };
}