import { Injectable, Logger } from '@nestjs/common';
import { load } from 'cheerio';
import type { Currency } from '@prisma/client';
import { BaseListingParser, ParsedListing } from './base.strategy.js';
import { ParserInvalidPageError } from './cian.strategy.js';
import { randomUserAgent } from '../utils/user-agents.js';

@Injectable()
export class DomClickParser extends BaseListingParser {
  readonly name = 'domclick';
  readonly hostnamePattern = /(^|\.)domclick\.ru$|(^|\.)domclick\.com$/i;
  private readonly logger = new Logger(DomClickParser.name);

  async parse(url: string): Promise<ParsedListing> {
    const proxyUrl = process.env.PARSER_PROXY_URL;
    const headers: Record<string, string> = {
      'User-Agent': randomUserAgent(),
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
      Referer: 'https://domclick.ru/',
    };

    type FetchLike = (input: string | URL, init?: { headers?: Record<string, string> }) => Promise<{
      ok: boolean;
      status: number;
      text(): Promise<string>;
    }>;

    let fetchImpl: FetchLike;
    if (proxyUrl) {
      const { fetch: proxyFetch } = await import('undici');
      fetchImpl = (async (input, init) => {
        const res = await proxyFetch(input, {
          method: 'GET',
          headers: { ...headers, ...(init?.headers ?? {}) },
        });
        return { ok: res.ok, status: res.status, text: () => res.text() };
      });
    } else {
      fetchImpl = (async (input, init) => {
        const res = await fetch(input, {
          method: 'GET',
          headers: { ...headers, ...(init?.headers ?? {}) },
        });
        return { ok: res.ok, status: res.status, text: () => res.text() };
      });
    }

    this.logger.log(`Fetching ${url}`);
    const response = await fetchImpl(url);

    if (!response.ok) {
      throw new ParserInvalidPageError(`DomClick: HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = load(html);

    // JSON-LD
    const ld = $('script[type="application/ld+json"]').first().text();
    if (ld) {
      try {
        const data = JSON.parse(ld) as Record<string, unknown>;
        const mapped = this.mapJsonLd(data, url);
        if (mapped) return mapped;
      } catch {
        // ignore
      }
    }

    return this.extractFromDom($, url);
  }

  private mapJsonLd(data: Record<string, unknown>, sourceUrl: string): ParsedListing | null {
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

    return {
      source: 'LINK',
      sourceUrl,
      title: name,
      price,
      currency: this.normalizeCurrency(currency),
      city,
      address: typeof address?.streetAddress === 'string' ? address.streetAddress : undefined,
      description: typeof data.description === 'string' ? data.description : undefined,
      ...(photos ? { photos } : {}),
    };
  }

  private extractPhotos(data: Record<string, unknown>): string[] | undefined {
    const img = data.image;
    if (typeof img === 'string') return [img];
    if (Array.isArray(img)) return img.filter((u): u is string => typeof u === 'string');
    return undefined;
  }

  private extractFromDom($: ReturnType<typeof load>, sourceUrl: string): ParsedListing {
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
    const u = c.toUpperCase();
    if (u === 'RUB' || u === 'RUR') return 'RUB';
    if (u === 'USD') return 'USD';
    if (u === 'EUR') return 'EUR';
    if (u === 'PLN') return 'PLN';
    return 'RUB';
  }
}

function parsePrice(text: string | null | undefined): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[^\d]/g, '');
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : null;
}