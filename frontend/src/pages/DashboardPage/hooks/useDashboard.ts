import { useCallback, useEffect, useState } from 'react';
import { flatApi } from '@/entities/Flat/utils/api';
import { remindersApi } from '@/shared/api/endpoints';
import type { Apartment } from '@/entities/Flat/model/types';
import type { Reminder } from '@/shared/api/types';
import { EMPTY_STATUS_COUNTS, STATUS_ORDER } from '../model/types';
import type { StatusCounts } from '../model/types';

export interface UseDashboardReturn {
  loading: boolean;
  error: boolean;
  apartments: Apartment[];
  total: number;
  reminders: Reminder[];
  statusCounts: StatusCounts;
  loadDashboard: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [total, setTotal] = useState(0);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>(EMPTY_STATUS_COUNTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [apartmentsResponse, remindersResponse, ...statusResponses] = await Promise.all([
        flatApi.getList({ pageSize: 100 }),
        remindersApi.list({ status: 'PENDING' }),
        ...STATUS_ORDER.map((status) => flatApi.getList({ status, pageSize: 1 })),
      ]);
      setApartments(apartmentsResponse.data);
      setTotal(apartmentsResponse.meta.total);
      setReminders(remindersResponse.data.data);
      setStatusCounts(STATUS_ORDER.reduce<StatusCounts>((counts, status, index) => {
        counts[status] = statusResponses[index].meta.total;
        return counts;
      }, { ...EMPTY_STATUS_COUNTS }));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  return { loading, error, apartments, total, reminders, statusCounts, loadDashboard };
}