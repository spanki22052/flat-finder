import { apiClient } from '@/shared/api/client';
import type {
  Apartment,
  ApartmentsResponse,
  CreateApartmentPayload,
  UpdateApartmentPayload,
  GetApartmentsParams,
  ParsedApartment,
} from '../model/types';

export const flatApi = {
  getList: async (params?: GetApartmentsParams) => {
    const { data } = await apiClient.get<ApartmentsResponse>('/apartments', { params });
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await apiClient.get<{ data: Apartment }>(`/apartments/${id}`);
    return data.data;
  },

  create: async (payload: CreateApartmentPayload) => {
    const { data } = await apiClient.post<{ data: Apartment }>('/apartments', payload);
    return data.data;
  },

  update: async (id: string, payload: UpdateApartmentPayload) => {
    const { data } = await apiClient.patch<{ data: Apartment }>(`/apartments/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/apartments/${id}`);
  },

  updateTags: async (id: string, tags: string[]) => {
    const { data } = await apiClient.patch<{ data: Apartment }>(`/apartments/${id}/tags`, { tags });
    return data.data;
  },

  parseLink: async (url: string): Promise<ParsedApartment> => {
    const { data } = await apiClient.post<{ data: ParsedApartment }>('/apartments/parse-link', { url });
    return data.data;
  },
};