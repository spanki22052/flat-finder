import { Injectable, Logger } from '@nestjs/common';
import { BaseListingParser, ParsedListing } from './base.strategy.js';
import { randomDelay } from '../utils/delays.js';
import { randomUserAgent } from '../utils/user-agents.js';
import { createStealthContext, launchStealthBrowser } from '../utils/stealth.js';
import { ParserBlockedError, ParserInvalidPageError } from './cian.strategy.js';
import {
  lightFetch, looksBlocked,
} from '../utils/light-fetch.js';
import { extractPhones } from '../utils/phones.js';

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

  /**
   * Avito — CSR SPA. SSR-страница не содержит данных объявления
   * (нет JSON-LD, нет item-секции в __preloadedState__). light-парсинг
   * может только обнаружить блокировку; данные берём из DOM после рендера.
   */
  private async lightParse(_url: string): Promise<ParsedListing | null> {
    try {
      const { html } = await lightFetch(_url, {
        referer: 'https://www.avito.ru/',
        timeoutMs: 8000,
      });
      if (looksBlocked(html)) {
        this.logger.warn(`Avito light-fetch detected block markers: ${_url}`);
        throw new ParserBlockedError('Avito: страница похожа на капчу/блокировку');
      }
    } catch (err) {
      if (err instanceof ParserBlockedError) throw err;
      this.logger.debug(`Avito light-fetch failed: ${err instanceof Error ? err.message : err}`);
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

      // Avito — CSR: данные карточки подтягиваются JS-бандлом после mount.
      // Ждём появления маркера заголовка; если не появится — бросаем понятную ошибку.
      try {
        await page.waitForSelector(
          '[data-marker="item-view/title-info"], h1',
          { state: 'visible', timeout: 15000 },
        );
      } catch {
        // fallback: подождём чуть дольше и попробуем снова на всякий случай
        await randomDelay(2000, 3000);
        const present = await page.evaluate(() => Boolean(
          document.querySelector('[data-marker="item-view/title-info"]')
          || document.querySelector('h1'),
        ));
        if (!present) {
          throw new ParserInvalidPageError('Avito: карточка объявления не отрендерилась (возможна блокировка или неверный URL)');
        }
      }
      await randomDelay(800, 1500);

      const html = await page.content();
      if (looksBlocked(html)) {
        throw new ParserBlockedError('Avito: страница похожа на капчу/блокировку');
      }

      return await this.extractFromDom(page, url);
    } finally {
      await browser.close();
    }
  }

  // ─── DOM fallback ───────────────────────────────────────────────────────
  private async extractFromDom(page: import('playwright').Page, sourceUrl: string): Promise<ParsedListing> {
    // Дополнительно подождём появления цены и описания, если они ещё не отрендерились.
    try {
      await page.waitForSelector(
        '[data-marker="item-view/item-price"], [itemprop="price"]',
        { state: 'visible', timeout: 5000 },
      );
    } catch { /* если цены нет в DOM — продолжим с тем, что есть */ }

    const data = await page.evaluate(() => {
      const text = (sel: string) => document.querySelector(sel)?.textContent?.trim() ?? null;

      // Заголовок: data-marker → h1 → title
      const title = text('[data-marker="item-view/title-info"]')
        ?? text('h1')
        ?? (document.title.trim() || null);

      // Цена: data-marker → itemprop=price → <span class*="price"> → meta og:price:amount
      const priceText = text('[data-marker="item-view/item-price"]')
        ?? text('[itemprop="price"]')
        ?? text('[class*="item-price"]')
        ?? document.querySelector<HTMLElement>('meta[itemprop="price"]')?.getAttribute('content')
        ?? null;

      // Адрес
      const address = text('[data-marker="item-view/item-address"]')
        ?? text('[itemprop="address"]')
        ?? text('[class*="item-address"]')
        ?? null;

      // Город (часто входит в адрес строкой "Город, ...")
      const cityText = text('[data-marker="item-view/item-location"]')
        ?? text('.style-item-address__string-wtd61')
        ?? text('[class*="item-location"]')
        ?? null;

      // Описание
      const description = text('[data-marker="item-view/item-description"]')
        ?? text('[data-marker="item-description"]')
        ?? text('[class*="item-description"]')
        ?? null;

      // Параметры (комнаты/этаж/площадь)
      const paramsList = Array.from(document.querySelectorAll<HTMLElement>(
        '[data-marker="item-view/item-params"] li, .params-paramsList__item-_2R3P, [class*="params"] li',
      ))
        .map((el) => el.textContent?.trim() ?? '')
        .filter(Boolean);

      // Галерея
      const photos = Array.from(document.querySelectorAll<HTMLImageElement>(
        '[data-marker="item-view/gallery"] img, [data-marker="image-frame/image"] img, [class*="gallery"] img',
      ))
        .map((img) => img.currentSrc || img.src)
        .filter(Boolean);

      return { title, priceText, address, cityText, description, paramsList, photos };
    });

    const price = parsePrice(data.priceText);
    const city = parseCity(data.cityText, data.address, sourceUrl);

    const rooms = findParamNumber(data.paramsList, /(\d+)\s*-?\s*к/i);
    const area = findParamNumber(data.paramsList, /(\d+(?:[.,]\d+)?)\s*м²/i);
    const { floor, totalFloors } = parseFloorFromParams(data.paramsList);

    if (!data.title || price == null || !city) {
      const marker = await page.evaluate(() => Boolean(document.querySelector('[data-marker="item-view/title-info"]')));
      if (!marker) {
        throw new ParserInvalidPageError('Avito: страница не содержит карточки объявления (возможна блокировка или неверный URL)');
      }
      throw new ParserInvalidPageError('Avito: не удалось разобрать карточку (нет title/price/city)');
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
      phones: extractPhones(data.description),
    };
  }
}

function parsePrice(text: string | null): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[^\d]/g, '');
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : null;
}

function parseCity(cityText: string | null, address: string | null, sourceUrl?: string): string | null {
  const fromText = (s: string | null) => {
    if (!s) return null;
    const head = s.split(',')[0]?.trim();
    return head || null;
  };
  return fromText(cityText) ?? fromText(address) ?? inferCityFromUrl(sourceUrl) ?? null;
}

function inferCityFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const seg = u.pathname.split('/').filter(Boolean)[0];
    if (!seg) return null;
    // slug → readable: 'tyumen' → 'Тюмень' (минимальный набор, расширяем по необходимости)
    const known: Record<string, string> = {
      moskva: 'Москва', spb: 'Санкт-Петербург', 'sankt-peterburg': 'Санкт-Петербург',
      tyumen: 'Тюмень', ekaterinburg: 'Екатеринбург', novosibirsk: 'Новосибирск',
      kazan: 'Казань', nizhnij_novgorod: 'Нижний Новгород', krasnoyarsk: 'Красноярск',
      rostov: 'Ростов-на-Дону', samara: 'Самара', ufa: 'Уфа', chelyabinsk: 'Челябинск',
      krasnodar: 'Краснодар', perm: 'Пермь', voronezh: 'Воронеж',
    };
    const norm = seg.toLowerCase().replace(/[^a-zа-яё0-9_-]/gi, '');
    return known[norm] ?? (norm.charAt(0).toUpperCase() + norm.slice(1));
  } catch {
    return null;
  }
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