import { apiClient } from '@/shared/api/client';
import type { Room, RoomMember, CreateRoomPayload, JoinRoomPayload } from '../model/types';

export const roomApi = {
  getList: async (): Promise<Room[]> => {
    const { data } = await apiClient.get<{ data: Room[] }>('/rooms');
    return data.data;
  },

  getOne: async (id: string): Promise<Room> => {
    const { data } = await apiClient.get<{ data: Room }>(`/rooms/${id}`);
    return data.data;
  },

  create: async (payload: CreateRoomPayload): Promise<Room> => {
    const { data } = await apiClient.post<{ data: Room }>('/rooms', payload);
    return data.data;
  },

  join: async (payload: JoinRoomPayload): Promise<Room> => {
    const { data } = await apiClient.post<{ data: Room }>('/rooms/join', payload);
    return data.data;
  },

  getMembers: async (id: string): Promise<RoomMember[]> => {
    const { data } = await apiClient.get<{ data: RoomMember[] }>(`/rooms/${id}/members`);
    return data.data;
  },

  regenerateInviteCode: async (id: string): Promise<Room> => {
    const { data } = await apiClient.post<{ data: Room }>(`/rooms/${id}/invite-code/regenerate`);
    return data.data;
  },

  removeMember: async (roomId: string, userId: string): Promise<{ removed: boolean }> => {
    const { data } = await apiClient.delete<{ data: { removed: boolean } }>(`/rooms/${roomId}/members/${userId}`);
    return data.data;
  },

  update: async (id: string, payload: { name: string }): Promise<Room> => {
    const { data } = await apiClient.patch<{ data: Room }>(`/rooms/${id}`, payload);
    return data.data;
  },

  leave: async (id: string): Promise<{ left: boolean }> => {
    const { data } = await apiClient.delete<{ data: { left: boolean } }>(`/rooms/${id}/leave`);
    return data.data;
  },
};
