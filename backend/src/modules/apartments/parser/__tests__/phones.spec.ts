import { extractPhones } from '../utils/phones.js';

describe('extractPhones', () => {
  it('returns [] for empty / nullish input', () => {
    expect(extractPhones(null)).toEqual([]);
    expect(extractPhones(undefined)).toEqual([]);
    expect(extractPhones('')).toEqual([]);
    expect(extractPhones('no phones here')).toEqual([]);
  });

  it('extracts and normalizes +7 numbers', () => {
    expect(extractPhones('Звоните +7 (999) 123-45-67')).toEqual(['+79991234567']);
    expect(extractPhones('Тел: +7 999 123 45 67')).toEqual(['+79991234567']);
  });

  it('normalizes 8-prefixed numbers to +7', () => {
    expect(extractPhones('8 (999) 123-45-67')).toEqual(['+79991234567']);
    expect(extractPhones('8 999 123 45 67')).toEqual(['+79991234567']);
  });

  it('returns unique values', () => {
    expect(extractPhones('+79991234567 и +7 (999) 123-45-67')).toEqual(['+79991234567']);
  });

  it('extracts multiple phones', () => {
    expect(extractPhones('Звоните +79991234567 или +79997654321')).toEqual([
      '+79991234567',
      '+79997654321',
    ]);
  });

  it('ignores invalid lengths', () => {
    expect(extractPhones('+1234')).toEqual([]);
    expect(extractPhones('Короткий 12345')).toEqual([]);
  });
});