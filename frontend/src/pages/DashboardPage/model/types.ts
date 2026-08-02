import type { ApartmentStatus } from '@/entities/Flat/model/types';

export const STATUS_LABELS: Record<ApartmentStatus, string> = {
  NEW: 'Новая',
  ACTIVE: 'В работе',
  CALLBACK: 'Перезвон',
  VIEWING: 'Просмотр',
  REJECTED: 'Отклонена',
  DONE: 'Готова',
};

export const ACTIVITY_COLORS = ['#e77c43', '#8d735b', '#69825b', '#af8a47'];

export const STATUS_TONES: Record<ApartmentStatus, string> = {
  NEW: '#964325',
  ACTIVE: '#4f7a52',
  CALLBACK: '#9b6a2b',
  VIEWING: '#3d6b8a',
  DONE: '#88726b',
  REJECTED: '#ba1a1a',
};

export const STATUS_ORDER: ApartmentStatus[] = ['NEW', 'ACTIVE', 'CALLBACK', 'VIEWING', 'DONE', 'REJECTED'];
export const FLOW_STATUSES: ApartmentStatus[] = ['NEW', 'ACTIVE', 'CALLBACK', 'VIEWING'];
export const ARCHIVE_STATUSES: ApartmentStatus[] = ['DONE', 'REJECTED'];

export type StatusCounts = Record<ApartmentStatus, number>;

export const EMPTY_STATUS_COUNTS: StatusCounts = {
  NEW: 0,
  ACTIVE: 0,
  CALLBACK: 0,
  VIEWING: 0,
  REJECTED: 0,
  DONE: 0,
};

export interface DashboardData {
  apartments: import('@/entities/Flat/model/types').Apartment[];
  total: number;
  reminders: import('@/shared/api/types').Reminder[];
  statusCounts: StatusCounts;
}