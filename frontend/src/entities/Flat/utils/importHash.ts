import type { HtmlParseSource } from '../model/types';

const EXTENSION_SOURCES: HtmlParseSource[] = ['avito', 'domclick', 'cian', 'yandex'];

export interface ExtensionPayload {
  source: HtmlParseSource;
  html: string;
  sourceUrl?: string;
}

/**
 * Decodes the `#data=<base64>` fragment produced by the Chrome extension.
 * Returns null if the fragment is missing or malformed — callers should
 * treat that as "nothing to import" rather than a hard error.
 */
export function decodeImportHash(hash: string): ExtensionPayload | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);
  const encoded = params.get('data');
  if (!encoded) return null;

  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(json) as Partial<ExtensionPayload>;
    if (
      typeof parsed.html !== 'string'
      || !parsed.html.trim()
      || typeof parsed.source !== 'string'
      || !EXTENSION_SOURCES.includes(parsed.source as HtmlParseSource)
    ) {
      return null;
    }
    return {
      source: parsed.source as HtmlParseSource,
      html: parsed.html,
      sourceUrl: typeof parsed.sourceUrl === 'string' ? parsed.sourceUrl : undefined,
    };
  } catch {
    return null;
  }
}
