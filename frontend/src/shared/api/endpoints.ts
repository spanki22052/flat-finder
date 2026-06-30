import { apiClient } from '@/shared/api/client';
import type {
  User, AuthResponse,
  Contact,
  Call, CreateCallPayload,
  Reminder, CreateReminderPayload, UpdateReminderPayload,
  ApiResponse,
} from './types';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    apiClient.post<AuthResponse>('/auth/register', { email, password, name }),
  me: () => apiClient.get<User>('/auth/me'),
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

export const callsApi = {
  list: (params?: Record<string, string | number>) =>
    apiClient.get<ApiResponse<Call[]> & { meta: { page: number; pageSize: number; total: number } }>(
      `/calls${params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : ''}`
    ),
  create: (payload: CreateCallPayload) =>
    apiClient.post<ApiResponse<Call>>('/calls', payload),
  delete: (id: string) =>
    apiClient.delete(`/calls/${id}`),
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
