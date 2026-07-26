import { useEffect, useState, useCallback } from 'react';
import { remindersApi } from '@/shared/api/endpoints';
import type { Reminder } from '@/shared/api/types';

const POLL_MS = 60_000;
const PREVIEW_LIMIT = 6;

interface PendingState {
  count: number;
  items: Reminder[];
}

export function usePendingReminders() {
  const [state, setState] = useState<PendingState>({ count: 0, items: [] });

  const refresh = useCallback(async () => {
    try {
      const res = await remindersApi.list({ status: 'PENDING' });
      const items = res.data.data ?? [];
      const total = res.data.meta?.total ?? items.length;
      const sorted = [...items].sort(
        (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
      );
      setState({ count: total, items: sorted.slice(0, PREVIEW_LIMIT) });
    } catch {
      setState({ count: 0, items: [] });
    }
  }, []);

  useEffect(() => {
    let alive = true;
    refresh();
    const id = window.setInterval(() => {
      if (alive) refresh();
    }, POLL_MS);
    const onVisible = () => {
      if (!document.hidden) refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  return { pendingCount: state.count, pendingItems: state.items, refresh };
}
