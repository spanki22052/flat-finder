import { YandexRealtyParser } from '../strategies/yandex.strategy.js';

describe('YandexRealtyParser hostname match', () => {
  const parser = new YandexRealtyParser();

  it('matches yandex.ru and realty.yandex.ru', () => {
    expect(parser.matches('https://realty.yandex.ru/offer/12345/')).toBe(true);
    expect(parser.matches('https://yandex.ru/realty/offer/12345/')).toBe(true);
    expect(parser.matches('https://www.yandex.ru/x')).toBe(true);
    expect(parser.matches('https://cian.ru/x')).toBe(false);
  });
});

describe('YandexRealtyParser helpers', () => {
  const parser = new YandexRealtyParser();

  it('parsePrice extracts integer price', () => {
    const fn = (parser as unknown as { parsePrice?: (s: string | null) => number | null }).parsePrice;
    expect(fn?.('12 500 000 ₽')).toBe(12500000);
    expect(fn?.('120 000')).toBe(120000);
    expect(fn?.('')).toBeNull();
  });

  it('findParamNumber handles Russian patterns', () => {
    const fn = (parser as unknown as { findParamNumber?: (p: string[], r: RegExp) => number | undefined }).findParamNumber;
    expect(fn?.(['2 комнаты'], /(\d+)\s*-?\s*к/i)).toBe(2);
    expect(fn?.(['54,3 м²'], /(\d+(?:[.,]\d+)?)\s*м/i)).toBe(54.3);
    expect(fn?.(['Этаж 3 из 16'], /этаж\s*(\d+)/i)).toBe(3);
    expect(fn?.(['Этаж 3 из 16'], /из\s*(\d+)/i)).toBe(16);
  });
});