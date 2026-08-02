/**
 * Generates initials from a full name (up to 2 first letters).
 */
export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Russian singular/plural for total counts.
 */
export function pluralApartments(n: number): string {
  if (n === 1) return 'объявление';
  return 'объявлений';
}

/**
 * Map axios-like parser errors to user-facing messages.
 */
export function describeParseError(err: unknown): string {
  const data = (err as { response?: { data?: { error?: { code?: string; message?: string } } } })?.response?.data;
  const code = data?.error?.code;
  const message = data?.error?.message;
  if (code === 'PARSER_BLOCKED') return 'Сайт нас заблокировал. Заполните вручную.';
  if (code === 'PARSER_UNSUPPORTED_SOURCE') return message ?? 'Этот источник пока не поддерживается';
  if (code === 'PARSER_INVALID_PAGE' || code === 'PARSER_TIMEOUT') {
    return message ?? 'Не удалось разобрать страницу';
  }
  return message ?? 'Не удалось получить данные по ссылке';
}