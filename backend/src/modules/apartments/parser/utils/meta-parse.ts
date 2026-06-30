/**
 * Утилиты для парсинга meta-тегов и текстовых полей.
 */

export function matchMeta(html: string, attr: string): string | null {
  const re = new RegExp(`<meta\\s+[^>]*${attr.replace(/"/g, '"')}[^>]*content="([^"]*)"`, 'i');
  const m = re.exec(html);
  return m && typeof m[1] === 'string' ? m[1] : null;
}

export function htmlTitle(html: string): string | null {
  const m = /<title>([\s\S]*?)<\/title>/i.exec(html);
  return m && typeof m[1] === 'string' ? m[1].trim() : null;
}

const ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ', '&amp;': '&', '&quot;': '"', '&#39;': "'", '&apos;': "'",
  '&lt;': '<', '&gt;': '>', '&laquo;': '«', '&raquo;': '»',
};

export function decodeEntities(s: string): string {
  let out = s;
  for (const [ent, ch] of Object.entries(ENTITY_MAP)) {
    out = out.split(ent).join(ch);
  }
  out = out.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
  return out;
}

export function extractRoomsFromText(text: string | null | undefined): number | undefined {
  if (!text) return undefined;
  // "1-комн.", "2-комнатная", "3-к. квартира"
  const m = text.match(/(\d+)\s*[-–]?\s*(?:комн|комнатная|к\.|к\b)/i);
  return m ? Number(m[1]) : undefined;
}

export function extractAreaFromText(text: string | null | undefined): number | undefined {
  if (!text) return undefined;
  // "58 м²", "58 м.кв.", "58 м кв", "58,3 м²"
  const m = text.match(/(\d+(?:[.,]\d+)?)\s*(?:м²|м\.кв\.|м\s*кв|м\b)/i);
  if (!m) return undefined;
  const n = parseFloat(m[1].replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

export function extractFloorFromTitle(text: string | null | undefined): { floor?: number; totalFloors?: number } | null {
  if (!text) return null;
  // "этаж 14/14", "этаж 5/9"
  const m = text.match(/этаж\s*(\d+)\s*\/\s*(\d+)/i);
  if (m) return { floor: Number(m[1]), totalFloors: Number(m[2]) };
  // "14/14 этаж"
  const m2 = text.match(/(\d+)\s*\/\s*(\d+)\s*этаж/i);
  if (m2) return { floor: Number(m2[1]), totalFloors: Number(m2[2]) };
  return null;
}

const URL_CITY_MAP: Record<string, string> = {
  'tyumen.cian.ru': 'Тюмень',
  'msk.cian.ru': 'Москва',
  'spb.cian.ru': 'Санкт-Петербург',
  'kazan.cian.ru': 'Казань',
  'ekb.cian.ru': 'Екатеринбург',
  'nsk.cian.ru': 'Новосибирск',
  'krd.cian.ru': 'Краснодар',
  'sochi.cian.ru': 'Сочи',
  'rnd.cian.ru': 'Ростов-на-Дону',
  'samara.cian.ru': 'Самара',
  'ufa.cian.ru': 'Уфа',
  'nn.cian.ru': 'Нижний Новгород',
  'voronezh.cian.ru': 'Воронеж',
  'volgograd.cian.ru': 'Волгоград',
  'krasnoyarsk.cian.ru': 'Красноярск',
  'omsk.cian.ru': 'Омск',
  'chelyabinsk.cian.ru': 'Челябинск',
  'irkutsk.cian.ru': 'Иркутск',
  'barnaul.cian.ru': 'Барнаул',
  'kemerovo.cian.ru': 'Кемерово',
  'tomsk.cian.ru': 'Томск',
  'perm.cian.ru': 'Пермь',
  'orenburg.cian.ru': 'Оренбург',
};

export function inferCityFromUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (URL_CITY_MAP[host]) return URL_CITY_MAP[host];
    if (host === 'cian.ru' || host === 'www.cian.ru') return 'Москва';
  } catch {
    // ignore
  }
  return null;
}

export function parsePriceFromText(text: string): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[^\d]/g, '');
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : null;
}

export function findParamNumber(params: string[], re: RegExp): number | undefined {
  for (const p of params) {
    const m = p.match(re);
    if (m) {
      const n = parseFloat(m[1].replace(',', '.'));
      if (Number.isFinite(n)) return n;
    }
  }
  return undefined;
}

export function parseFloorFromParams(params: string[]): { floor?: number; totalFloors?: number } {
  for (const p of params) {
    const m = p.match(/этаж\s*(\d+)\s*из\s*(\d+)/i);
    if (m) return { floor: Number(m[1]), totalFloors: Number(m[2]) };
    const m2 = p.match(/(\d+)\s*\/\s*(\d+)\s*этаж/i);
    if (m2) return { floor: Number(m2[1]), totalFloors: Number(m2[2]) };
  }
  return {};
}