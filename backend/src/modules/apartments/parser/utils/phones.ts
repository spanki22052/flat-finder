/**
 * Извлекает телефонные номера из произвольного текста.
 * Поддерживает российские форматы: +7, 8, с разделителями и без.
 * Возвращает уникальные номера, нормализованные к виду +7XXXXXXXXXX.
 */
const PHONE_PATTERNS: RegExp[] = [
  /\+7[\s\-()]*\d{3}[\s\-()]*\d{3}[\s\-()]*\d{2}[\s\-()]*\d{2}/g,
  /8[\s\-()]*\(?\d{3}\)?[\s\-()]*\d{3}[\s\-()]*\d{2}[\s\-()]*\d{2}/g,
];

export function extractPhones(text: string | null | undefined): string[] {
  if (!text) return [];
  const found = new Set<string>();
  for (const pattern of PHONE_PATTERNS) {
    const matches = text.match(pattern);
    if (!matches) continue;
    for (const raw of matches) {
      const digits = raw.replace(/\D/g, '');
      // Берём только 11-значные российские номера (7XXXXXXXXXX или 8XXXXXXXXXX)
      if (digits.length !== 11) continue;
      const normalized = digits.startsWith('8') ? `+7${digits.slice(1)}` : `+${digits}`;
      found.add(normalized);
    }
  }
  return Array.from(found);
}