export interface ApiResponse<T = unknown> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function success<T>(data: T, meta?: ApiMeta): ApiResponse<T> {
  return { data, ...(meta ? { meta } : {}) };
}

export function paginated<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number,
): ApiResponse<T[]> {
  return {
    data,
    meta: { page, pageSize, total },
  };
}
