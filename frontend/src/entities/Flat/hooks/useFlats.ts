import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flatApi } from '../utils/api';
import type { CreateApartmentPayload, UpdateApartmentPayload, GetApartmentsParams } from '../model/types';

export const FLAT_KEYS = {
  all: ['flats'] as const,
  lists: () => [...FLAT_KEYS.all, 'list'] as const,
  list: (params: GetApartmentsParams) => [...FLAT_KEYS.lists(), params] as const,
  details: () => [...FLAT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...FLAT_KEYS.details(), id] as const,
};

export function useGetFlats(params?: GetApartmentsParams) {
  return useQuery({
    queryKey: FLAT_KEYS.list(params ?? {}),
    queryFn: () => flatApi.getList(params),
  });
}

export function useGetFlat(id: string) {
  return useQuery({
    queryKey: FLAT_KEYS.detail(id),
    queryFn: () => flatApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateFlat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApartmentPayload) => flatApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLAT_KEYS.lists() });
    },
  });
}

export function useUpdateFlat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateApartmentPayload }) =>
      flatApi.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: FLAT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: FLAT_KEYS.lists() });
    },
  });
}

export function useDeleteFlat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => flatApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLAT_KEYS.lists() });
    },
  });
}

export function useUpdateFlatTags() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tags }: { id: string; tags: string[] }) =>
      flatApi.updateTags(id, tags),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: FLAT_KEYS.detail(id) });
    },
  });
}
