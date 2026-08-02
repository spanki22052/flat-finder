import type { ApartmentStatus } from '@/entities/Flat/model/types';

export const STATUS_LABELS: Record<ApartmentStatus, string> = {
  NEW: 'Новая',
  ACTIVE: 'Активная',
  CALLBACK: 'Перезвон',
  VIEWING: 'Просмотр',
  REJECTED: 'Отклонена',
  DONE: 'Готова',
};

export const COLLAPSE_LINES = 6;
export const PHOTO_LIMIT = 4;