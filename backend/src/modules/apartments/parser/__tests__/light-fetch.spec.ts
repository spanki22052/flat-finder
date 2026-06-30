import {
  BLOCK_MARKERS, extractInlineConfig, extractJsonLd, extractNextData,
  getNumber, getString, looksBlocked, normalizeCurrency,
} from '../utils/light-fetch.js';

describe('looksBlocked', () => {
  it.each([
    'cf-challenge-running',
    'SmartCaptcha контейнер',
    'checking your browser before accessing',
    'access denied',
    'antibot защита',
  ])('detects block marker in: %s', (marker) => {
    expect(looksBlocked(`<html><body>${marker}</body></html>`)).toBe(true);
  });

  it('returns false for clean page', () => {
    expect(looksBlocked('<html><body>Квартира в Москве</body></html>')).toBe(false);
  });

  it('BLOCK_MARKERS contains expected entries', () => {
    expect(BLOCK_MARKERS).toEqual(expect.arrayContaining(['smartcaptcha', 'qrator']));
  });
});

describe('extractJsonLd', () => {
  it('extracts Apartment from application/ld+json', () => {
    const html = `<script type="application/ld+json">${JSON.stringify({
      '@type': 'Apartment', name: 'X', offers: { price: 1, priceCurrency: 'RUB' },
    })}</script>`;
    expect(extractJsonLd(html)?.['@type']).toBe('Apartment');
  });

  it('handles Offer @type', () => {
    const html = `<script type="application/ld+json">${JSON.stringify({
      '@type': 'Offer', name: 'X', price: 1, priceCurrency: 'RUB',
    })}</script>`;
    expect(extractJsonLd(html)?.['@type']).toBe('Offer');
  });

  it('returns null when no valid JSON-LD', () => {
    expect(extractJsonLd('<html></html>')).toBeNull();
    expect(extractJsonLd('<script type="application/ld+json">not json</script>')).toBeNull();
  });

  it('skips invalid JSON blocks', () => {
    const html = `<script type="application/ld+json">broken{</script>
      <script type="application/ld+json">${JSON.stringify({ '@type': 'Apartment', name: 'X' })}</script>`;
    expect(extractJsonLd(html)?.['@type']).toBe('Apartment');
  });
});

describe('extractNextData', () => {
  it('extracts __NEXT_DATA__ payload', () => {
    const html = `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify({ foo: 'bar' })}</script>`;
    expect(extractNextData(html)).toEqual({ foo: 'bar' });
  });

  it('extracts __NUXT_DATA__ payload', () => {
    const html = `<script id="__NUXT_DATA__">${JSON.stringify({ foo: 'baz' })}</script>`;
    expect(extractNextData(html)).toEqual({ foo: 'baz' });
  });

  it('returns null when missing', () => {
    expect(extractNextData('<html></html>')).toBeNull();
  });
});

describe('extractInlineConfig', () => {
  it('extracts window._cianConfig', () => {
    const cfg = { flat: { title: 'X' } };
    const html = `<script>window._cianConfig = ${JSON.stringify(cfg)};</script>`;
    expect(extractInlineConfig(html, ['_cianConfig'])).toEqual(cfg);
  });

  it('tries multiple variable names', () => {
    const cfg = { foo: 1 };
    const html = `<script>window.__INITIAL_STATE__ = ${JSON.stringify(cfg)};</script>`;
    expect(extractInlineConfig(html, ['_cianConfig', '__INITIAL_STATE__'])).toEqual(cfg);
  });

  it('returns null when none found', () => {
    expect(extractInlineConfig('<html></html>', ['__foo__'])).toBeNull();
  });
});

describe('normalizeCurrency', () => {
  it.each([
    ['RUB', 'RUB'], ['rub', 'RUB'], ['RUR', 'RUB'],
    ['USD', 'USD'], ['EUR', 'EUR'], ['PLN', 'PLN'],
    [undefined, 'RUB'], ['', 'RUB'], ['XYZ', 'RUB'],
  ])('normalizeCurrency(%s) -> %s', (input, expected) => {
    expect(normalizeCurrency(input as string)).toBe(expected);
  });
});

describe('getString', () => {
  it('walks nested path', () => {
    expect(getString({ a: { b: { c: 'hi' } } }, ['a', 'b', 'c'])).toBe('hi');
  });

  it('returns undefined when path missing', () => {
    expect(getString({ a: 1 }, ['a', 'b'])).toBeUndefined();
    expect(getString(null, ['a'])).toBeUndefined();
  });

  it('returns undefined for non-string leaves', () => {
    expect(getString({ a: { b: 123 } }, ['a', 'b'])).toBeUndefined();
  });
});

describe('getNumber', () => {
  it('parses numbers and numeric strings', () => {
    expect(getNumber({ a: 42 }, ['a'])).toBe(42);
    expect(getNumber({ a: '12 500' }, ['a'])).toBe(12500);
    expect(getNumber({ a: '54,3' }, ['a'])).toBe(54.3);
  });

  it('returns undefined for invalid', () => {
    expect(getNumber({ a: 'not a number' }, ['a'])).toBeUndefined();
    expect(getNumber({}, ['a'])).toBeUndefined();
  });
});