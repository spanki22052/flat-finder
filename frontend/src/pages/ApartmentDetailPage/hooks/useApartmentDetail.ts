import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import dayjs from 'dayjs';
import { flatApi } from '@/entities/Flat/utils/api';
import type { Apartment } from '@/entities/Flat/model/types';
import type { Reminder } from '@/shared/api/types';

export function useApartmentDetail(id: string | undefined) {
  const navigate = useNavigate();
  const [apt, setApt] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextReminder, setNextReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      flatApi.getOne(id),
      flatApi.getNextReminder(id).catch(() => null),
    ])
      .then(([aptData, reminder]) => {
        setApt(aptData);
        setNextReminder(reminder);
      })
      .catch(() => {
        message.error('Не загружено');
        navigate('/apartments');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const refetchNextReminder = () => {
    if (!id) return;
    flatApi.getNextReminder(id).then(setNextReminder).catch(() => setNextReminder(null));
  };

  return { apt, loading, nextReminder, setNextReminder, refetchNextReminder };
}

export interface MeetingFormValues {
  title: string;
  dueAt: dayjs.Dayjs;
}

export async function saveMeeting(
  apt: Apartment,
  nextReminder: Reminder | null,
  values: MeetingFormValues,
): Promise<void> {
  const dueAt = values.dueAt.toISOString();
  if (nextReminder) {
    await import('@/shared/api/endpoints').then(({ remindersApi }) =>
      remindersApi.update(nextReminder.id, { title: values.title, dueAt }),
    );
    message.success('Встреча обновлена');
  } else {
    await import('@/shared/api/endpoints').then(({ remindersApi }) =>
      remindersApi.create({ title: values.title, dueAt, apartmentId: apt.id }),
    );
    message.success('Встреча запланирована');
  }
}

export async function cancelMeeting(nextReminder: Reminder | null): Promise<void> {
  if (!nextReminder) return;
  try {
    const { remindersApi } = await import('@/shared/api/endpoints');
    await remindersApi.delete(nextReminder.id);
    message.success('Встреча отменена');
  } catch {
    message.error('Ошибка');
  }
}