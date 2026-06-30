import { load } from 'cheerio';
import type { ParsedListing } from '../strategies/base.strategy.js';
import { DomClickParser } from '../strategies/domclick.strategy.js';
import { ParserInvalidPageError } from '../strategies/cian.strategy.js';

const URL_DOMCLICK = 'https://domclick.ru/card/sale?offerId=12345';

describe('DomClickParser', () => {
  const parser = new DomClickParser();

  it('matches domclick.ru hostnames', () => {
    expect(parser.matches('https://domclick.ru/x')).toBe(true);
    expect(parser.matches('https://www.domclick.ru/x')).toBe(true);
    expect(parser.matches('https://domclick.com/x')).toBe(true);
    expect(parser.matches('https://cian.ru/x')).toBe(false);
    expect(parser.matches('not a url')).toBe(false);
  });

  it('parses via JSON-LD when available', async () => {
    const html = `
      <html><head>
        <script type="application/ld+json">
          ${JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Apartment',
            name: '2-к квартира, 54 м², 5/9 эт.',
            description: 'Светлая квартира с ремонтом',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Москва',
              streetAddress: 'ул. Пушкина, д. 10',
            },
            offers: { '@type': 'Offer', price: 85000, priceCurrency: 'RUB' },
            image: ['https://cdn.domclick.ru/photo1.jpg', 'https://cdn.domclick.ru/photo2.jpg'],
          })}
        </script>
      </head><body><h1>title</h1></body></html>`;

    const $ = load(html);
    const data = JSON.parse($('script[type="application/ld+json"]').text());
    const mapped = (parser as unknown as {
      mapJsonLd: (data: Record<string, unknown>, url: string) => ParsedListing | null;
    }).mapJsonLd(data, URL_DOMCLICK);

    expect(mapped).toEqual({
      source: 'LINK',
      sourceUrl: URL_DOMCLICK,
      title: '2-к квартира, 54 м², 5/9 эт.',
      price: 85000,
      currency: 'RUB',
      city: 'Москва',
      address: 'ул. Пушкина, д. 10',
      description: 'Светлая квартира с ремонтом',
      photos: ['https://cdn.domclick.ru/photo1.jpg', 'https://cdn.domclick.ru/photo2.jpg'],
    });
  });

  it('falls back to DOM scraping when JSON-LD missing', async () => {
    const html = `
      <html><body>
        <h1>2-к квартира в центре</h1>
        <div data-testid="price-value">120 000 ₽</div>
        <div data-testid="object-address">Москва, ул. Тверская, д. 1</div>
      </body></html>`;

    const $ = load(html);
    const mapped = (parser as unknown as {
      extractFromDom: ($: ReturnType<typeof load>, url: string) => ParsedListing;
    }).extractFromDom($, URL_DOMCLICK);

    expect(mapped.title).toBe('2-к квартира в центре');
    expect(mapped.price).toBe(120000);
    expect(mapped.city).toBe('Москва');
    expect(mapped.address).toBe('Москва, ул. Тверская, д. 1');
    expect(mapped.currency).toBe('RUB');
  });

  it('throws ParserInvalidPageError on missing data', async () => {
    const html = `<html><body><div>непонятная страница</div></body></html>`;
    const $ = load(html);
    expect(() =>
      (parser as unknown as {
        extractFromDom: ($: ReturnType<typeof load>, url: string) => ParsedListing;
      }).extractFromDom($, URL_DOMCLICK),
    ).toThrow(ParserInvalidPageError);
  });
});