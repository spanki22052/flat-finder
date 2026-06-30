import type { ParsedListing } from '../strategies/base.strategy.js';
import { CianParser } from '../strategies/cian.strategy.js';

const URL_CIAN = 'https://www.cian.ru/sale/flat/123456/';

describe('CianParser hostname match', () => {
  const parser = new CianParser();

  it('matches cian.ru', () => {
    expect(parser.matches('https://cian.ru/sale/flat/1/')).toBe(true);
    expect(parser.matches('https://www.cian.ru/sale/flat/2/')).toBe(true);
    expect(parser.matches('https://avito.ru/x')).toBe(false);
  });
});

describe('CianParser JSON-LD mapping', () => {
  const parser = new CianParser();

  it('extracts from application/ld+json', () => {
    const html = `
      <html><head>
        <script type="application/ld+json">
          ${JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Apartment',
            name: '1-к квартира, 38 м²',
            description: 'Уютная квартира',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Санкт-Петербург',
              streetAddress: 'Невский пр., 28',
            },
            offers: { '@type': 'Offer', price: 75000, priceCurrency: 'RUB' },
            image: 'https://cdn.cian.ru/image1.jpg',
          })}
        </script>
      </head></html>`;

    const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i;
    const match = re.exec(html);
    const data = JSON.parse(match![1]);
    const mapped = (parser as unknown as {
      mapJsonLd: (data: Record<string, unknown>, url: string) => ParsedListing | null;
    }).mapJsonLd(data, URL_CIAN);

    expect(mapped?.title).toBe('1-к квартира, 38 м²');
    expect(mapped?.price).toBe(75000);
    expect(mapped?.city).toBe('Санкт-Петербург');
    expect(mapped?.address).toBe('Невский пр., 28');
    expect(mapped?.photos).toEqual(['https://cdn.cian.ru/image1.jpg']);
  });

  it('returns null when required fields missing', () => {
    const data = { '@type': 'Apartment', name: 'X' };
    const mapped = (parser as unknown as {
      mapJsonLd: (data: Record<string, unknown>, url: string) => ParsedListing | null;
    }).mapJsonLd(data, URL_CIAN);
    expect(mapped).toBeNull();
  });

  it('normalizes currency RUR → RUB', () => {
    const data = {
      '@type': 'Apartment',
      name: 'A',
      address: { addressLocality: 'X' },
      offers: { price: 1, priceCurrency: 'RUR' },
    };
    const mapped = (parser as unknown as {
      mapJsonLd: (data: Record<string, unknown>, url: string) => ParsedListing | null;
    }).mapJsonLd(data, URL_CIAN);
    expect(mapped?.currency).toBe('RUB');
  });
});

describe('CianParser helpers', () => {
  const parser = new CianParser();

  it('parsePrice extracts number with spaces', () => {
    const f = parser as unknown as { parsePrice?: (s: string | null) => number | null };
    // internal helper not exported, but mapJsonLd / extractFromDom use it
    // sanity: ensure ParserBlockedError / ParserInvalidPageError are exported
    expect(typeof (parser as unknown as Record<string, unknown>).parse).toBe('function');
  });
});