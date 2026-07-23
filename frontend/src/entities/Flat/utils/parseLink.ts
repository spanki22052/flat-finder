/**
 * Клиентская проверка URL перед вызовом POST /apartments/parse-link.
 * Должна совпадать с hostnamePattern бэкенд-стратегий.
 */
const SUPPORTED_HOST_PATTERNS: RegExp[] = [
  /(^|\.)cian\.ru$/i,
  /(^|\.)avito\.ru$/i,
  /(^|\.)yandex\.ru$/i,
  /(^|\.)realty\.yandex\.ru$/i,
  /(^|\.)domclick\.ru$/i,
  /(^|\.)domclick\.com$/i,
];

export function getParseLinkHostname(url: string): string | null {
  try {
    return new URL(url.trim()).hostname;
  } catch {
    return null;
  }
}

export function isSupportedParseUrl(url: string): boolean {
  const host = getParseLinkHostname(url);
  if (!host) return false;
  return SUPPORTED_HOST_PATTERNS.some((re) => re.test(host));
}

export const PARSE_LINK_PLACEHOLDER =
  'https://tyumen.domclick.ru/card/rent__flat__… или cian.ru / avito.ru';

export const PARSE_LINK_HINT =
  'Поддерживаются: CIAN, Avito, Яндекс Недвижимость, DomClick (в т.ч. tyumen.domclick.ru/card/…).';

