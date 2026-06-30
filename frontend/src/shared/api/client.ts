import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
  error?: { code: string; message: string; details?: unknown };
}

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getApiError(error: unknown): { code: string; message: string } {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    return {
      code: data?.error?.code ?? 'UNKNOWN',
      message: data?.error?.message ?? error.message,
    };
  }
  return { code: 'UNKNOWN', message: String(error) };
}
