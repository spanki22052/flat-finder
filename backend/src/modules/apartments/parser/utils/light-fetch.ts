import { Logger } from '@nestjs/common';
import { randomUserAgent } from './user-agents.js';
import type { Currency } from '@prisma/client';

export const BLOCK_MARKERS = [
  'smartcaptcha',
  'captcha-container',
  'cf-challenge',
  'cf-chl-bypass',
  'checking your browser',
  'access denied',
  'forbidden',
  'qrator',
  'antibot',
  'ваш браузер',
];

export function looksBlocked(html: string): boolean {
  const lower = html.toLowerCase();
  return BLOCK_MARKERS.some((m) => lower.includes(m));
}

export interface LightFetchResult {
  html: string;
  finalUrl: string;
}

const logger = new Logger('LightFetch');

/**
 * Делает HTTP GET без браузера с реалистичными заголовками.
 * Возвращает { html, finalUrl } либо бросает ошибку при сетевых проблемах.
 */
export async function lightFetch(url: string, opts: {
  referer?: string;
  cookies?: string;
  timeoutMs?: number;
  extraHeaders?: Record<string, string>;
} = {}): Promise<LightFetchResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 8000);

  const headers: Record<string, string> = {
    'User-Agent': randomUserAgent(),
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    ...(opts.referer ? { Referer: opts.referer } : {}),
    ...(opts.cookies ? { Cookie: opts.cookies } : {}),
    ...(opts.extraHeaders ?? {}),
  };

  try {
    const proxyUrl = process.env.PARSER_PROXY_URL;
    if (proxyUrl) {
      const { fetch: proxyFetch } = await import('undici');
      const res = await proxyFetch(url, {
        method: 'GET',
        headers,
        redirect: 'follow',
        signal: controller.signal,
      });
      const text = await res.text();
      return { html: text, finalUrl: url };
    }

    const res = await fetch(url, {
      method: 'GET',
      headers,
      redirect: 'follow',
      signal: controller.signal,
    });
    const text = await res.text();
    return { html: text, finalUrl: url };
  } catch (err) {
    logger.debug(`lightFetch failed for ${url}: ${err instanceof Error ? err.message : String(err)}`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Достаёт первый валидный JSON-LD объекта с @type=Apartment (или Offer/Residence/Product).
 * Возвращает распарсенный объект либо null.
 */
export function extractJsonLd(html: string): Record<string, unknown> | null {
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const raw = match[1];
    try {
      const parsed = JSON.parse(raw);
      const candidates = Array.isArray(parsed) ? parsed : [parsed];
      for (const c of candidates) {
        if (!c || typeof c !== 'object') continue;
        const t = (c as Record<string, unknown>)['@type'];
        const types = Array.isArray(t) ? t : t ? [t] : [];
        if (types.some((x) => typeof x === 'string'
          && /Apartment|Residence|Product|Offer|House|Accommodation/i.test(x as string))) {
          return c as Record<string, unknown>;
        }
      }
      // Если нет подходящего @type — вернём первый объект как fallback
      if (candidates.length > 0 && candidates[0] && typeof candidates[0] === 'object') {
        return candidates[0] as Record<string, unknown>;
      }
    } catch {
      // skip
    }
  }
  return null;
}

/**
 * Достаёт JSON из window.__NEXT_DATA__ (Next.js) или аналогичных SSR-payloads.
 */
export function extractNextData(html: string): Record<string, unknown> | null {
  const patterns = [
    /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i,
    /window\.__NEXT_DATA__\s*=\s*(\{[\s\S]*?\});?\s*<\/script>/i,
    /<script[^>]*id=["']__NUXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i,
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (!m) continue;
    try {
      const parsed = JSON.parse(m[1]);
      if (parsed && typeof parsed === 'object') return parsed as Record<string, unknown>;
    } catch {
      // skip
    }
  }
  return null;
}

/**
 * Достаёт JSON из window._cianConfig / cianConfig / подобных SSR-state.
 */
export function extractInlineConfig(html: string, varNames: string[]): Record<string, unknown> | null {
  for (const name of varNames) {
    const patterns = [
      new RegExp(`window\\.${name}\\s*=\\s*(\\{[\\s\\S]*?\\});?\\s*<\\/script>`, 'i'),
      new RegExp(`window\\["${name}"\\]\\s*=\\s*(\\{[\\s\\S]*?\\});?\\s*<\\/script>`, 'i'),
    ];
    for (const re of patterns) {
      const m = re.exec(html);
      if (!m) continue;
      try {
        const parsed = JSON.parse(m[1]);
        if (parsed && typeof parsed === 'object') return parsed as Record<string, unknown>;
      } catch {
        // skip
      }
    }
  }
  return null;
}

export function normalizeCurrency(c: string | undefined | null): Currency {
  const u = (c ?? '').toUpperCase();
  if (u === 'RUB' || u === 'RUR') return 'RUB';
  if (u === 'USD') return 'USD';
  if (u === 'EUR') return 'EUR';
  if (u === 'PLN') return 'PLN';
  return 'RUB';
}

export function getString(obj: unknown, path: string[]): string | undefined {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return typeof cur === 'string' ? cur : undefined;
}

export function getNumber(obj: unknown, path: string[]): number | undefined {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  if (typeof cur === 'number' && Number.isFinite(cur)) return cur;
  if (typeof cur === 'string') {
    const n = parseFloat(cur.replace(/\s/g, '').replace(',', '.'));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}