import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ROOM_KEYS, useGetRooms } from '../../entities/Room/hooks/useRooms';
import type { Room } from '../../entities/Room/model/types';
import { useAuth } from './AuthProvider';

interface RoomContextValue {
  rooms: Room[];
  currentRoomId: string | null;
  currentRoom: Room | null;
  isLoading: boolean;
  selectRoom: (roomId: string) => void;
  clearRoom: () => void;
  refetchRooms: () => Promise<unknown>;
}

const RoomContext = createContext<RoomContextValue | null>(null);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(localStorage.getItem('roomId'));
  const { data: rooms = [], isLoading, refetch } = useGetRooms(isAuthenticated);

  const selectRoom = useCallback((roomId: string) => {
    localStorage.setItem('roomId', roomId);
    setCurrentRoomId(roomId);
  }, []);

  const clearRoom = useCallback(() => {
    localStorage.removeItem('roomId');
    setCurrentRoomId(null);
    queryClient.clear();
  }, [queryClient]);

  const currentRoom = useMemo(
    () => rooms.find((r) => r.id === currentRoomId) ?? null,
    [rooms, currentRoomId],
  );

  const refetchRooms = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ROOM_KEYS.lists() });
    return refetch();
  }, [queryClient, refetch]);

  return (
    <RoomContext.Provider
      value={{ rooms, currentRoomId, currentRoom, isLoading, selectRoom, clearRoom, refetchRooms }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error('useRoom must be used inside RoomProvider');
  return ctx;
}
