import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CianParser } from '../strategies/cian.strategy.js';
import {
  extractJsonLd, extractInlineConfig,
} from '../utils/light-fetch.js';
import { htmlTitle, matchMeta } from '../utils/meta-parse.js';

const FIXTURE_PATH = resolve(__dirname, 'fixtures', 'cian-sample.html');

function loadFixture(): string {
  return readFileSync(FIXTURE_PATH, 'utf8');
}

describe('CianParser with real CIAN page', () => {
  let parser: CianParser;

  beforeEach(() => {
    parser = new CianParser();
  });

  it('parses og:title and og:description from real CIAN HTML', () => {
    const html = loadFixture();
    const title = htmlTitle(html);
    const ogTitle = matchMeta(html, 'property="og:title"');
    const ogDesc = matchMeta(html, 'property="og:description"');

    expect(ogTitle).toContain('Сдаётся 1-комнатная квартира');
    expect(ogTitle).toMatch(/28\s*000/);
    expect(ogTitle).toMatch(/58/);
    expect(ogTitle).toMatch(/14\/14/);
    expect(ogDesc).toContain('Тюмень');
    expect(title ?? '').toContain('Мельничная');
  });

  it('extracts JSON-LD Product with embedded Offer', () => {
    const html = loadFixture();
    const ld = extractJsonLd(html);
    expect(ld).not.toBeNull();
    expect(ld?.['@type']).toBe('Product');
    expect(ld?.['name']).toContain('Сдается 1-комн');
    const offer = ld?.['offers'] as Record<string, unknown> | undefined;
    expect(offer?.['price']).toBe(28000);
    expect(offer?.['priceCurrency']).toBe('RUB');
    const images = ld?.['image'] as string[] | undefined;
    expect(images && images.length).toBeGreaterThan(0);
  });

  it('does not detect blocking markers in real CIAN page', async () => {
    const html = loadFixture();
    // Простой smoke — нет антибот-маркеров
    expect(html.toLowerCase()).not.toContain('smartcaptcha');
    expect(html.toLowerCase()).not.toContain('cf-challenge');
  });

  it('builds ParsedListing from JSON-LD + og:* meta tags (simulating mapJsonLd logic)', () => {
    const html = loadFixture();
    const ld = extractJsonLd(html) as Record<string, unknown> | null;
    expect(ld).not.toBeNull();
    // Вызываем приватный через рефлексию для теста
    const mapped = (parser as unknown as {
      mapJsonLd: (d: Record<string, unknown>, h: string, u: string) => {
        title: string; price: number; currency: string; city: string; address?: string;
        rooms?: number; area?: number; floor?: number; totalFloors?: number; photos?: string[];
      } | null;
    }).mapJsonLd(ld!, html, 'https://tyumen.cian.ru/rent/flat/331090051/');

    expect(mapped).not.toBeNull();
    expect(mapped!.title).toContain('Сдается 1-комн');
    expect(mapped!.price).toBe(28000);
    expect(mapped!.currency).toBe('RUB');
    expect(mapped!.city).toBe('Тюмень');
    expect(mapped!.rooms).toBe(1);
    expect(mapped!.area).toBe(58);
    expect(mapped!.floor).toBe(14);
    expect(mapped!.totalFloors).toBe(14);
    expect(mapped!.address).toBeTruthy();
    expect(mapped!.photos && mapped!.photos.length).toBeGreaterThan(0);
  });

  it('falls back to meta tags via mapFromMetaTags', () => {
    const html = loadFixture();
    const mapped = (parser as unknown as {
      mapFromMetaTags: (h: string, u: string) => {
        title: string; price: number; currency: string; city: string; rooms?: number;
        area?: number; floor?: number; totalFloors?: number;
      } | null;
    }).mapFromMetaTags(html, 'https://tyumen.cian.ru/rent/flat/331090051/');

    expect(mapped).not.toBeNull();
    expect(mapped!.title).toContain('Сдаётся 1-комнатная');
    expect(mapped!.price).toBe(28000);
    expect(mapped!.city).toBe('Тюмень');
    expect(mapped!.area).toBe(58);
    expect(mapped!.floor).toBe(14);
    expect(mapped!.totalFloors).toBe(14);
  });
});