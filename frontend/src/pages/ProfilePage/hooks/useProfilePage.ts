import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { authApi, remindersApi, usersApi } from '@/shared/api/endpoints';
import { flatApi } from '@/entities/Flat/utils/api';
import type { User } from '@/shared/api/types';
import type { MemberStats } from '../model/types';

async function fetchMemberStats(userId: string): Promise<MemberStats> {
  try {
    const { apiClient } = await import('@/shared/api/client');
    const allForMember = await apiClient
      .get<{ data: Array<{ status: string }>; meta: { total: number } }>(
        '/apartments',
        { params: { assigneeId: userId, pageSize: 100 } },
      )
      .then((r) => ({
        total: r.data.meta?.total ?? 0,
        items: r.data.data ?? [],
      }));
    const items = allForMember.items;
    return {
      apartments: allForMember.total,
      callbacks: items.filter((a) => a.status === 'CALLBACK').length,
      viewings: items.filter((a) => a.status === 'VIEWING').length,
      done: items.filter((a) => a.status === 'DONE').length,
    };
  } catch {
    return { apartments: 0, callbacks: 0, viewings: 0, done: 0 };
  }
}

export interface UseProfilePageReturn {
  user: User | null;
  loading: boolean;
  apartmentsTotal: number;
  remindersTotal: number;
  memberStats: MemberStats | null;
  reloadSelf: () => Promise<void>;
}

export function useProfilePage(targetId?: string, isSelf = true): UseProfilePageReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [apartmentsTotal, setApartmentsTotal] = useState(0);
  const [remindersTotal, setRemindersTotal] = useState(0);
  const [memberStats, setMemberStats] = useState<MemberStats | null>(null);

  const loadSelf = useCallback(async () => {
    const [meResponse, apartmentsResponse, remindersResponse] = await Promise.all([
      authApi.me(),
      flatApi.getList({ pageSize: 1 }),
      remindersApi.list({ status: 'PENDING' }),
    ]);
    setUser(meResponse.data.data.user);
    setApartmentsTotal(apartmentsResponse.meta.total);
    setRemindersTotal(remindersResponse.data.meta.total);
  }, []);

  const loadTeammate = useCallback(async (id: string) => {
    const [userResponse, stats] = await Promise.all([
      usersApi.get(id),
      fetchMemberStats(id),
    ]);
    setUser(userResponse.data.data);
    setMemberStats(stats);
    setApartmentsTotal(stats.apartments);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMemberStats(null);
    setApartmentsTotal(0);
    setRemindersTotal(0);

    const load = async () => {
      try {
        if (isSelf) {
          await loadSelf();
        } else if (targetId) {
          await loadTeammate(targetId);
        }
      } catch {
        if (!cancelled) {
          message.error(isSelf ? 'Не удалось загрузить профиль' : 'Не удалось загрузить участника');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [targetId, isSelf, loadSelf, loadTeammate]);

  const reloadSelf = useCallback(async () => {
    if (!isSelf) return;
    setLoading(true);
    try {
      await loadSelf();
    } catch {
      message.error('Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  }, [isSelf, loadSelf]);

  return { user, loading, apartmentsTotal, remindersTotal, memberStats, reloadSelf };
}
