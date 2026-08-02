import type { Apartment } from '@/entities/Flat/model/types';

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
 * First word of a name, fallback to the whole string if empty.
 */
export function firstName(name: string): string {
  return name.split(' ')[0] || name;
}

/**
 * Greeting based on the hour of the day.
 */
export function greetingForHour(hour: number): string {
  if (hour < 5) return 'Доброй ночи';
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
}

/**
 * Format apartment price as ru-RU currency.
 */
export function formatPrice(apartment: Apartment): string {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: apartment.currency,
  }).format(apartment.price);
}

/**
 * Human-readable relative due date label.
 */
export function formatDueAt(dueAt: string): string {
  const date = new Date(dueAt);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return `Сегодня, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Завтра, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}