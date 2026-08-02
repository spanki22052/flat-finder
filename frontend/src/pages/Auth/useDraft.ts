import { useEffect, useRef, useState, useCallback } from 'react';

const PREFIX = 'ff.auth.draft.';

export type Draft<T extends object> = {
  values: T;
  savedAt: number | null;
};

export function useDraft<T extends object>(key: string, initial: T) {
  const storageKey = `${PREFIX}${key}`;
  const [values, setValues] = useState<T>(initial);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Draft<T>;
        setValues({ ...initial, ...parsed.values });
        setSavedAt(parsed.savedAt);
      }
    } catch {
      // ignore
    } finally {
      hydrated.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const at = Date.now();
    setSavedAt(at);
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ values, savedAt: at }));
      } catch {
        // ignore
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [values, storageKey]);

  const update = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const clear = useCallback(() => {
    try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    setValues(initial);
    setSavedAt(null);
  }, [storageKey, initial]);

  return { values, savedAt, update, clear, setValues };
}

export function formatSavedAt(at: number | null): string {
  if (!at) return 'черновик не сохранён';
  const d = new Date(at);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `черновик · ${hh}:${mm}:${ss}`;
}