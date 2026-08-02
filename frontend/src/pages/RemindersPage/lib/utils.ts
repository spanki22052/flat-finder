import dayjs from 'dayjs';
import type { ReminderStatus } from '@/shared/api/types';
import type { DateBucket, DateFilter } from '../model/types';

/**
 * Generates initials from a full name (up to 2 first letters).
 */
export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Russian pluralization helper: `pluralize(1, 'задача', 'задачи', 'задач')`.
 */
export function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

/**
 * Bucket a reminder into overdue/today/tomorrow/later/done based on its dueAt.
 */
export function getBucket(dueAt: string, status: ReminderStatus): DateBucket {
  if (status !== 'PENDING') return 'done';
  const now = dayjs().startOf('day');
  const due = dayjs(dueAt).startOf('day');
  if (due.isBefore(now)) return 'overdue';
  if (due.isSame(now)) return 'today';
  if (due.isSame(now.add(1, 'day'))) return 'tomorrow';
  return 'later';
}

/**
 * Build the 7-day week starting from today (Monday).
 */
export function buildWeek(): dayjs.Dayjs[] {
  const start = dayjs().startOf('week');
  return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
}

/**
 * Short HH:mm format.
 */
export function formatTimeShort(dueAt: string): string {
  return dayjs(dueAt).format('HH:mm');
}

/**
 * Human-friendly day label relative to today.
 */
export function formatRelativeDay(dueAt: string): string {
  const due = dayjs(dueAt);
  const now = dayjs();
  if (due.isSame(now, 'day')) return 'Сегодня';
  if (due.isSame(now.add(1, 'day'), 'day')) return 'Завтра';
  if (due.isBefore(now, 'day')) return `Просрочено · ${due.fromNow()}`;
  if (due.isBefore(now.add(7, 'day'))) return due.format('dddd');
  return due.format('D MMM');
}

/**
 * Full date + time format.
 */
export function formatFullDate(dueAt: string): string {
  return dayjs(dueAt).format('D MMM, HH:mm');
}

/**
 * Is the dueAt in the current ISO week?
 */
export function isCurrentWeek(dueAt: string): boolean {
  const start = dayjs().startOf('week');
  const end = dayjs().endOf('week');
  const due = dayjs(dueAt);
  return due.isAfter(start) && due.isBefore(end);
}

/**
 * Should the reminder be visible for the given filter?
 */
export function matchesFilter(dueAt: string, status: ReminderStatus, filter: DateFilter): boolean {
  if (filter === 'all') return true;
  const bucket = getBucket(dueAt, status);
  if (filter === 'overdue') return bucket === 'overdue';
  if (filter === 'today') return bucket === 'today' || bucket === 'overdue';
  if (filter === 'week') return isCurrentWeek(dueAt);
  if (filter === 'done') return status !== 'PENDING';
  return true;
}

/**
 * Distance from today, in days (signed).
 */
export function distanceFor(dueAt: string): number {
  const due = dayjs(dueAt).startOf('day');
  const today = dayjs().startOf('day');
  return due.diff(today, 'day');
}