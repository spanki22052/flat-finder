import { load } from 'cheerio';
import type { ParsedListing } from '../strategies/base.strategy.js';
import {
  DomClickParser,
  extractDomclickSsrState,
  isDomclickBlocked,
} from '../strategies/domclick.strategy.js';
import { ParserInvalidPageError } from '../strategies/cian.strategy.js';

const URL_DOMCLICK = 'https://tyumen.domclick.ru/card/rent__flat__2078584220';

function buildSsrHtml(productCard: Record<string, unknown>): string {
  const state = {
    agency: {},
    productCard,
    REGIONS: { displayName: 'Москва' },
  };
  // Имитируем реальный DomClick: литерал undefined внутри объекта
  const json = JSON.stringify(state).replace(
    '"popoiData":null',
    '"popoiData":undefined',
  );
  return `<!DOCTYPE html><html><head>
    <meta property="og:title" content="fallback title">
    <script>window.__SSR_STATE__ = ${json};
window.__SSR_CONTEXT__ = {};</script>
  </head><body></body></html>`;
}

describe('DomClickParser', () => {
  const parser = new DomClickParser();

  it('matches domclick.ru hostnames including regional subdomains', () => {
    expect(parser.matches('https://domclick.ru/x')).toBe(true);
    expect(parser.matches('https://www.domclick.ru/x')).toBe(true);
    expect(parser.matches('https://tyumen.domclick.ru/card/rent__flat__2078584220')).toBe(true);
    expect(parser.matches('https://domclick.com/x')).toBe(true);
    expect(parser.matches('https://cian.ru/x')).toBe(false);
    expect(parser.matches('not a url')).toBe(false);
  });

  it('does not treat listing HTML with forbidden substring as blocked', () => {
    const html = buildSsrHtml({
      id: 1,
      address: { locality: 'Тюмень', name: 'ул. 1' },
      objectInfo: { rooms: 1, area: 40, floor: 2 },
      house: { info: { floors: 9 } },
      priceInfo: { price: 30000, currency: 'RUB' },
      photos: [],
      seller: { agent: {} },
    });
    // слово forbidden в бандле/комментарии не должно ронять карточку
    expect(isDomclickBlocked(`${html}<!-- forbidden -->`)).toBe(false);
    expect(isDomclickBlocked('<html>access denied captcha</html>')).toBe(true);
  });

  it('extracts __SSR_STATE__ even when undefined literals present', () => {
    const html = `<script>window.__SSR_STATE__ = {"a":1,"b":undefined,"productCard":{"id":1}};
window.__SSR_CONTEXT__ = {};</script>`;
    const state = extractDomclickSsrState(html);
    expect(state).toEqual({ a: 1, b: null, productCard: { id: 1 } });
  });

  it('parses productCard from __SSR_STATE__', () => {
    const html = buildSsrHtml({
      id: 2078584220,
      dealType: 'rent',
      offerType: 'flat',
      href: 'tyumen.domclick.ru/card/rent__flat__2078584220',
      address: {
        locality: 'Тюмень',
        name: 'Первомайская улица, 50',
        displayNameShort: 'Тюмень, Первомайская улица, 50',
        parents: [
          { kind: 'street', name: 'Первомайская улица' },
          { kind: 'district', name: 'Калининский' },
          { kind: 'locality', name: 'Тюмень' },
        ],
      },
      objectInfo: {
        rooms: 1,
        area: 46,
        floor: 3,
        kitchenArea: 13,
        description: 'Сдаётся 1к квартира в Тюмени, звоните +7 906 123 45 67',
        renovation: 'Евро',
      },
      house: { info: { floors: 24, buildYear: 2016 } },
      priceInfo: { price: 35000, currency: 'RUB', commission: 70 },
      photos: [
        { url: '/vitrina/ad/73/photo1.jpg', isPlan: false },
        { url: 'https://img.dmclk.ru/vitrina/already-absolute.jpg', isPlan: false },
      ],
      seller: {
        agent: { phone: '+7 906 *** ** 16', fullName: 'Агент' },
      },
      originalProduct: {
        description: 'Сдаётся 1к квартира',
      },
    });

    const mapped = parser.mapFromSsrState(html, URL_DOMCLICK);
    expect(mapped).toMatchObject({
      source: 'LINK',
      sourceUrl: URL_DOMCLICK,
      title: '1-к квартира, 46 м², 3/24 эт.',
      price: 35000,
      currency: 'RUB',
      city: 'Тюмень',
      district: 'Калининский',
      address: 'Первомайская улица, 50',
      rooms: 1,
      area: 46,
      floor: 3,
      totalFloors: 24,
      photos: [
        'https://img.dmclk.ru/vitrina/ad/73/photo1.jpg',
        'https://img.dmclk.ru/vitrina/already-absolute.jpg',
      ],
      phones: ['+79061234567'],
    });
    expect(mapped?.description).toContain('Сдаётся 1к квартира');
  });

  it('parseHtml uses SSR → meta pipeline', () => {
    const html = buildSsrHtml({
      address: { locality: 'Тюмень', name: 'ул. А' },
      objectInfo: { rooms: 2, area: 50, floor: 1 },
      house: { info: { floors: 5 } },
      priceInfo: { price: 40000, currency: 'RUB' },
      photos: [],
      seller: { agent: {} },
    });
    const mapped = parser.parseHtml(html, URL_DOMCLICK, { throwOnFail: true });
    expect(mapped?.price).toBe(40000);
    expect(mapped?.city).toBe('Тюмень');
  });

  it('parses via JSON-LD when available', () => {
    const data = {
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
    };

    const mapped = (parser as unknown as {
      mapJsonLd: (data: Record<string, unknown>, url: string) => ParsedListing | null;
    }).mapJsonLd(data, 'https://domclick.ru/card/sale?offerId=12345');

    expect(mapped).toEqual({
      source: 'LINK',
      sourceUrl: 'https://domclick.ru/card/sale?offerId=12345',
      title: '2-к квартира, 54 м², 5/9 эт.',
      price: 85000,
      currency: 'RUB',
      city: 'Москва',
      address: 'ул. Пушкина, д. 10',
      description: 'Светлая квартира с ремонтом',
      photos: ['https://cdn.domclick.ru/photo1.jpg', 'https://cdn.domclick.ru/photo2.jpg'],
    });
  });

  it('falls back to og:meta when SSR state missing', () => {
    const html = `<!DOCTYPE html><html><head>
      <meta property="og:title" content="Снять 1-комнатную квартиру, 46 м² по адресу Тюмень, Первомайская улица, 50, 3 этаж по цене 35 000 руб. в месяц - Домклик">
      <meta property="og:description" content="Снять 1-комнатную квартиру, 46 м²">
      <meta property="og:image" content="https://img.dmclk.ru/vitrina/ad/73/photo.jpg">
    </head><body></body></html>`;

    const mapped = parser.mapFromMetaTags(html, URL_DOMCLICK);
    expect(mapped).toMatchObject({
      source: 'LINK',
      price: 35000,
      currency: 'RUB',
      city: 'Тюмень',
      address: 'Первомайская улица, 50',
      rooms: 1,
      area: 46,
      floor: 3,
      photos: ['https://img.dmclk.ru/vitrina/ad/73/photo.jpg'],
    });
    expect(mapped?.title).toContain('1-комнатную квартиру');
    expect(mapped?.title).not.toMatch(/Домклик$/);
  });

  it('falls back to DOM scraping when JSON-LD missing', () => {
    const html = `
      <html><body>
        <h1>2-к квартира в центре</h1>
        <div data-testid="price-value">120 000 ₽</div>
        <div data-testid="object-address">Москва, ул. Тверская, д. 1</div>
      </body></html>`;

    const $ = load(html);
    const mapped = parser.extractFromDom($, URL_DOMCLICK);

    expect(mapped.title).toBe('2-к квартира в центре');
    expect(mapped.price).toBe(120000);
    expect(mapped.city).toBe('Москва');
    expect(mapped.address).toBe('Москва, ул. Тверская, д. 1');
    expect(mapped.currency).toBe('RUB');
  });

  it('throws ParserInvalidPageError on missing data', () => {
    const html = `<html><body><div>непонятная страница</div></body></html>`;
    const $ = load(html);
    expect(() => parser.extractFromDom($, URL_DOMCLICK)).toThrow(ParserInvalidPageError);
  });
});
