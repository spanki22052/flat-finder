import { apiClient } from '@/shared/api/client';
import type {
  User, AuthResponse,
  Contact,
  Reminder, CreateReminderPayload, UpdateReminderPayload,
  ApiResponse,
} from './types';

export const authApi = {
  login: (login: string, password: string) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', { login, password }),
  register: (username: string, password: string, name: string, email?: string) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/register', { username, password, name, email }),
  me: () => apiClient.get<ApiResponse<{ user: User }>>('/auth/me'),
};

export const contactsApi = {
  list: (params?: Record<string, string | number>) =>
    apiClient.get<ApiResponse<Contact[]> & { meta: { page: number; pageSize: number; total: number } }>(
      `/contacts${params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : ''}`
    ),
  create: (payload: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<ApiResponse<Contact>>('/contacts', payload),
  update: (id: string, payload: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>) =>
    apiClient.patch<ApiResponse<Contact>>(`/contacts/${id}`, payload),
  delete: (id: string) =>
    apiClient.delete(`/contacts/${id}`),
};

export const remindersApi = {
  list: (params?: Record<string, string>) =>
    apiClient.get<ApiResponse<Reminder[]> & { meta: { total: number } }>(
      `/reminders${params ? '?' + new URLSearchParams(Object.entries(params)).toString() : ''}`
    ),
  create: (payload: CreateReminderPayload) =>
    apiClient.post<ApiResponse<Reminder>>('/reminders', payload),
  update: (id: string, payload: UpdateReminderPayload) =>
    apiClient.patch<ApiResponse<Reminder>>(`/reminders/${id}`, payload),
  delete: (id: string) =>
    apiClient.delete(`/reminders/${id}`),
};
