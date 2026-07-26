import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomApi } from '../utils/api';
import type { CreateRoomPayload, JoinRoomPayload } from '../model/types';

export const ROOM_KEYS = {
  all: ['rooms'] as const,
  lists: () => [...ROOM_KEYS.all, 'list'] as const,
  details: () => [...ROOM_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ROOM_KEYS.details(), id] as const,
  members: (id: string) => [...ROOM_KEYS.detail(id), 'members'] as const,
};

export function useGetRooms(enabled = true) {
  return useQuery({
    queryKey: ROOM_KEYS.lists(),
    queryFn: () => roomApi.getList(),
    enabled,
  });
}

export function useGetRoom(id: string) {
  return useQuery({
    queryKey: ROOM_KEYS.detail(id),
    queryFn: () => roomApi.getOne(id),
    enabled: !!id,
  });
}

export function useGetRoomMembers(id: string) {
  return useQuery({
    queryKey: ROOM_KEYS.members(id),
    queryFn: () => roomApi.getMembers(id),
    enabled: !!id,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRoomPayload) => roomApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.lists() });
    },
  });
}

export function useJoinRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: JoinRoomPayload) => roomApi.join(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.lists() });
    },
  });
}

export function useRegenerateInviteCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roomApi.regenerateInviteCode(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.lists() });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      roomApi.update(id, { name }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.lists() });
    },
  });
}

export function useRemoveRoomMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
      roomApi.removeMember(roomId, userId),
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.members(roomId) });
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.detail(roomId) });
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.lists() });
    },
  });
}

export function useLeaveRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roomApi.leave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.lists() });
    },
  });
}
