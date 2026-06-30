export { apiClient, ApiError, getApiError } from './client';
export type { ApiResponse, ApiMeta } from './client';

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email?: string;
  username: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// ─── Contacts ────────────────────────────────────────────────────────────────
export interface Contact {
  id: string;
  name: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  email?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Calls ──────────────────────────────────────────────────────────────────
export type CallOutcome = 'REACHED' | 'NO_ANSWER' | 'VOICEMAIL' | 'BUSY' | 'CALLBACK';

export interface Call {
  id: string;
  apartmentId: string;
  contactId?: string;
  userId: string;
  calledAt: string;
  durationSec?: number;
  outcome: CallOutcome;
  notes?: string;
  createdAt: string;
  apartment?: { id: string; title: string; city: string };
  contact?: { id: string; name: string };
}

export interface CreateCallPayload {
  apartmentId: string;
  contactId?: string;
  durationSec?: number;
  outcome: CallOutcome;
  notes?: string;
}

// ─── Reminders ─────────────────────────────────────────────────────────────
export type ReminderStatus = 'PENDING' | 'DONE' | 'CANCELED';

export interface Reminder {
  id: string;
  apartmentId?: string;
  title: string;
  dueAt: string;
  status: ReminderStatus;
  assigneeId: string;
  createdAt: string;
  updatedAt: string;
  apartment?: { id: string; title: string; city: string };
  assignee?: { id: string; name: string };
}

export interface CreateReminderPayload {
  apartmentId?: string;
  title: string;
  dueAt: string;
}

export interface UpdateReminderPayload {
  title?: string;
  dueAt?: string;
  status?: ReminderStatus;
}

// ─── Stats ──────────────────────────────────────────────────────────────────
export interface DashboardStats {
  total: number;
  byStatus: Record<string, number>;
  recentCount: number;
}
