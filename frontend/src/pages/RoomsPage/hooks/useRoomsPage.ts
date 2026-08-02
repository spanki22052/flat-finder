import { useMemo, useState } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { useRoom } from '@/app/providers/RoomProvider';
import { useCreateRoom, useJoinRoom } from '@/entities/Room/hooks/useRooms';
import { getApiError } from '@/shared/api/client';
import type { CreateRoomValues, JoinRoomValues, RoomsMode, RoomsPageStats } from '../model/types';

export interface UseRoomsPageReturn {
  mode: RoomsMode;
  setMode: (m: RoomsMode) => void;
  createForm: FormInstance<CreateRoomValues>;
  joinForm: FormInstance<JoinRoomValues>;
  error: string | null;
  stats: RoomsPageStats;
  folio: { num: string; label: string };
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  handlePick: (roomId: string) => void;
  handleCreate: (values: CreateRoomValues) => Promise<void>;
  handleJoin: (values: JoinRoomValues) => Promise<void>;
  handleLogout: () => void;
  createPending: boolean;
  joinPending: boolean;
}

export function useRoomsPage(): UseRoomsPageReturn {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { rooms, isLoading, selectRoom } = useRoom();
  const createRoom = useCreateRoom();
  const joinRoom = useJoinRoom();
  const [mode, setMode] = useState<RoomsMode>('create');
  const [createForm] = Form.useForm<CreateRoomValues>();
  const [joinForm] = Form.useForm<JoinRoomValues>();
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const goToDestination = () => {
    const from = (location.state as { from?: { pathname: string } } | null)?.from;
    navigate(from?.pathname ?? '/dashboard', { replace: true });
  };

  const handlePick = (roomId: string) => {
    selectRoom(roomId);
    goToDestination();
  };

  const handleCreate = async (values: CreateRoomValues) => {
    setError(null);
    try {
      const room = await createRoom.mutateAsync({ name: values.name.trim() });
      selectRoom(room.id);
      goToDestination();
    } catch (err) {
      setError(getApiError(err).message);
    }
  };

  const handleJoin = async (values: JoinRoomValues) => {
    setError(null);
    try {
      const room = await joinRoom.mutateAsync({ inviteCode: values.inviteCode.trim().toUpperCase() });
      selectRoom(room.id);
      goToDestination();
    } catch (err) {
      setError(getApiError(err).message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const switchMode = (next: RoomsMode) => {
    setMode(next);
    setError(null);
  };

  const folio = useMemo(() => {
    if (mode === 'create') return { num: '01', label: 'новая комната' };
    return { num: '02', label: 'по коду приглашения' };
  }, [mode]);

  const stats: RoomsPageStats = useMemo(() => ({
    totalRooms: rooms.length,
    totalOwners: rooms.filter((r) => r.role === 'OWNER').length,
    totalPeople: rooms.reduce((sum, r) => sum + (r.membersCount ?? 0), 0),
  }), [rooms]);

  return {
    mode,
    setMode: switchMode,
    createForm,
    joinForm,
    error,
    stats,
    folio,
    hoveredId,
    setHoveredId,
    handlePick,
    handleCreate,
    handleJoin,
    handleLogout,
    createPending: createRoom.isPending,
    joinPending: joinRoom.isPending,
  };
}