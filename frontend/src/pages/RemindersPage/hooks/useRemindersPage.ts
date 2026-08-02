import { useEffect, useMemo, useState, useCallback } from 'react';
import { App, Form } from 'antd';
import dayjs from 'dayjs';
import { remindersApi } from '@/shared/api/endpoints';
import { flatApi } from '@/entities/Flat/utils/api';
import type { Reminder, ReminderStatus } from '@/shared/api/types';
import type { Apartment } from '@/entities/Flat/model/types';
import { STATUS_LABELS } from '../model/types';
import type {
  DateFilter, GroupedReminders, RemindersPageState, UseRemindersPageReturn,
} from '../model/types';
import { buildWeek, distanceFor as computeDistance, getBucket, matchesFilter } from '../lib/utils';

export function useRemindersPage(): UseRemindersPageReturn {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [data, setData] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DateFilter>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [apartments, setApartments] = useState<Apartment[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await remindersApi.list();
      setData(res.data.data);
    } catch {
      message.error('Не удалось загрузить напоминания');
    } finally {
      setLoading(false);
    }
  }, [message]);

  const fetchApartments = useCallback(async () => {
    try {
      const res = await flatApi.getList({ pageSize: 100 });
      setApartments(res.data);
    } catch {
      // тихо — список квартир не критичен
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);
  useEffect(() => { if (modalOpen) void fetchApartments(); }, [modalOpen, fetchApartments]);

  const week = useMemo(() => buildWeek(), []);
  const todayIso = dayjs().startOf('day').toISOString();

  const pending = useMemo(() => data.filter((r) => r.status === 'PENDING'), [data]);
  const completed = useMemo(() => data.filter((r) => r.status !== 'PENDING'), [data]);

  const countsByDay = useMemo(() => {
    const map = new Map<string, number>();
    pending.forEach((r) => {
      const key = dayjs(r.dueAt).startOf('day').toISOString();
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [pending]);

  const overdueCount = pending.filter((r) => getBucket(r.dueAt, r.status) === 'overdue').length;
  const todayCount = pending.filter((r) => getBucket(r.dueAt, r.status) === 'today').length;
  const headCount = overdueCount + todayCount;

  const visiblePending = useMemo(
    () => pending.filter((r) => {
      if (activeDay) {
        const key = dayjs(r.dueAt).startOf('day').toISOString();
        return key === activeDay;
      }
      return matchesFilter(r.dueAt, r.status, filter);
    }),
    [pending, filter, activeDay],
  );

  const visibleCompleted = useMemo(
    () => completed.filter((r) => matchesFilter(r.dueAt, r.status, filter)),
    [completed, filter],
  );

  const grouped: GroupedReminders = useMemo(() => {
    const out: GroupedReminders = { overdue: [], today: [], tomorrow: [], later: [] };
    visiblePending.forEach((r) => {
      const bucket = getBucket(r.dueAt, r.status);
      if (bucket === 'overdue') out.overdue.push(r);
      else if (bucket === 'today') out.today.push(r);
      else if (bucket === 'tomorrow') out.tomorrow.push(r);
      else out.later.push(r);
    });
    out.later.sort((a, b) => dayjs(a.dueAt).valueOf() - dayjs(b.dueAt).valueOf());
    return out;
  }, [visiblePending]);

  const openCreate = useCallback(() => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ dueTime: dayjs().hour(9).minute(0) });
    setModalOpen(true);
  }, [form]);

  const openEdit = useCallback((reminder: Reminder) => {
    setEditing(reminder);
    form.setFieldsValue({
      title: reminder.title,
      apartmentId: reminder.apartmentId,
      dueDate: dayjs(reminder.dueAt),
      dueTime: dayjs(reminder.dueAt),
    });
    setModalOpen(true);
  }, [form]);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleSave = useCallback(async () => {
    try {
      const vals = await form.validateFields();
      const dueDate = vals.dueDate as dayjs.Dayjs;
      const dueTime = (vals.dueTime as dayjs.Dayjs | undefined) ?? dayjs().hour(9).minute(0);
      const dueAt = dueDate
        .hour(dueTime.hour())
        .minute(dueTime.minute())
        .second(0)
        .millisecond(0)
        .toISOString();
      const payload = {
        title: vals.title,
        dueAt,
        apartmentId: vals.apartmentId || undefined,
      };
      if (editing) {
        await remindersApi.update(editing.id, payload);
        message.success('Напоминание обновлено');
      } else {
        await remindersApi.create(payload);
        message.success('Напоминание создано');
      }
      setModalOpen(false);
      void fetchData();
    } catch {
      // поля провалидированы antd
    }
  }, [form, editing, message, fetchData]);

  const handleStatus = useCallback(async (reminder: Reminder, status: ReminderStatus) => {
    try {
      await remindersApi.update(reminder.id, { status });
      message.success(STATUS_LABELS[status]);
      void fetchData();
    } catch {
      message.error('Не удалось обновить');
    }
  }, [message, fetchData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await remindersApi.delete(id);
      message.success('Удалено');
      void fetchData();
    } catch {
      message.error('Не удалось удалить');
    }
  }, [message, fetchData]);

  const distanceFor = useCallback((dueAt: string) => computeDistance(dueAt), []);

  const state: RemindersPageState = {
    data, loading, filter, modalOpen, editing, activeDay, apartments,
  };

  return {
    state, week, todayIso, pending, completed, countsByDay,
    overdueCount, todayCount, headCount,
    grouped, visibleCompleted, visiblePending,
    setFilter, setActiveDay,
    openCreate, openEdit, closeModal,
    handleSave, handleStatus, handleDelete,
    distanceFor,
  };
}