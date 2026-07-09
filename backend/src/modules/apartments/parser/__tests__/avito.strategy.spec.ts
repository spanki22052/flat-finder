import { AvitoParser } from '../strategies/avito.strategy.js';

describe('AvitoParser hostname match', () => {
  const parser = new AvitoParser();

  it('matches avito.ru', () => {
    expect(parser.matches('https://avito.ru/moskva/kvartiry/123')).toBe(true);
    expect(parser.matches('https://www.avito.ru/x')).toBe(true);
    expect(parser.matches('https://cian.ru/x')).toBe(false);
  });
});

describe('AvitoParser helpers', () => {
  const parser = new AvitoParser();

  it('parsePrice strips spaces and currency', () => {
    const fn = (parser as unknown as { parsePrice?: (s: string | null) => number | null }).parsePrice;
    expect(fn?.('120 000 ₽')).toBe(120000);
    expect(fn?.('1 250 000')).toBe(1250000);
    expect(fn?.('')).toBeNull();
    expect(fn?.(null)).toBeNull();
  });

  it('parseCity takes first comma-separated part', () => {
    const fn = (parser as unknown as { parseCity?: (a: string | null, b: string | null, u?: string) => string | null }).parseCity;
    expect(fn?.('Москва, Тверская', null)).toBe('Москва');
    expect(fn?.(null, 'Санкт-Петербург, Невский')).toBe('Санкт-Петербург');
    expect(fn?.(null, null)).toBeNull();
  });

  it('parseCity falls back to URL slug (tyumen → Тюмень)', () => {
    const fn = (parser as unknown as { parseCity?: (a: string | null, b: string | null, u?: string) => string | null }).parseCity;
    expect(fn?.(null, null, 'https://www.avito.ru/tyumen/kvartiry/1-k._kvartira_50_m_516_et._7626114474'))
      .toBe('Тюмень');
    expect(fn?.(null, null, 'https://www.avito.ru/moskva/kvartiry/123')).toBe('Москва');
  });

  it('findParamNumber extracts numeric params', () => {
    const fn = (parser as unknown as { findParamNumber?: (p: string[], r: RegExp) => number | undefined }).findParamNumber;
    expect(fn?.(['2 комнаты', '54 м²'], /(\d+)\s*-?\s*к/i)).toBe(2);
    expect(fn?.(['2 комнаты', '54 м²'], /(\d+(?:[.,]\d+)?)\s*м²/i)).toBe(54);
    expect(fn?.([], /(\d+)/)).toBeUndefined();
  });

  it('parseFloorFromParams handles "этаж X из Y" pattern', () => {
    const fn = (parser as unknown as {
      parseFloorFromParams?: (p: string[]) => { floor?: number; totalFloors?: number };
    }).parseFloorFromParams;
    expect(fn?.(['Этаж 5 из 9'])).toEqual({ floor: 5, totalFloors: 9 });
    expect(fn?.(['5/9 этаж'])).toEqual({ floor: 5, totalFloors: 9 });
    expect(fn?.(['no match'])).toEqual({});
  });
});