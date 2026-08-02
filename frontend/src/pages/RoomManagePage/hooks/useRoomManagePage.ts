import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useAuth } from '@/app/providers/AuthProvider';
import { useRoom } from '@/app/providers/RoomProvider';
import {
  useGetRoomMembers,
  useLeaveRoom,
  useRegenerateInviteCode,
  useRemoveRoomMember,
  useUpdateRoom,
} from '@/entities/Room/hooks/useRooms';
import { getApiError } from '@/shared/api/client';
import type { RoomManageMemberItem } from '../model/types';

export interface UseRoomManagePageReturn {
  currentRoom: ReturnType<typeof useRoom>['currentRoom'];
  isOwner: boolean;
  members: RoomManageMemberItem[];
  membersLoading: boolean;
  editName: string;
  editing: boolean;
  setEditing: (v: boolean) => void;
  setEditName: (v: string) => void;
  handleRename: () => Promise<void>;
  handleRegenerate: () => Promise<void>;
  handleCopy: () => Promise<void>;
  handleKick: (memberId: string, memberName: string) => Promise<void>;
  handleLeave: () => Promise<void>;
  renamePending: boolean;
  regeneratePending: boolean;
  leavePending: boolean;
  goBack: () => void;
}

export function useRoomManagePage(): UseRoomManagePageReturn {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRoom, clearRoom, refetchRooms } = useRoom();
  const roomId = currentRoom?.id;
  const isOwner = currentRoom?.role === 'OWNER';

  const { data: rawMembers = [], isLoading: membersLoading } = useGetRoomMembers(roomId ?? '');
  const updateRoom = useUpdateRoom();
  const regenerateInvite = useRegenerateInviteCode();
  const removeMember = useRemoveRoomMember();
  const leaveRoom = useLeaveRoom();

  const [editName, setEditName] = useState(currentRoom?.name ?? '');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (currentRoom && !editing) setEditName(currentRoom.name);
  }, [currentRoom, editing]);

  const members: RoomManageMemberItem[] = rawMembers.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role,
    isSelf: m.id === user?.id,
    initials: m.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || 'U',
  }));

  const handleRename = async () => {
    if (!currentRoom) return;
    if (editName.trim() === currentRoom.name || !editName.trim()) {
      setEditing(false);
      return;
    }
    try {
      await updateRoom.mutateAsync({ id: currentRoom.id, name: editName.trim() });
      message.success('Название обновлено');
      setEditing(false);
      refetchRooms();
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  const handleRegenerate = async () => {
    if (!currentRoom) return;
    try {
      await regenerateInvite.mutateAsync(currentRoom.id);
      message.success('Код приглашения обновлён');
      refetchRooms();
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  const handleCopy = async () => {
    if (!currentRoom) return;
    try {
      await navigator.clipboard.writeText(currentRoom.inviteCode);
      message.success('Код скопирован');
    } catch {
      message.error('Не удалось скопировать');
    }
  };

  const handleKick = async (memberId: string, memberName: string) => {
    if (!currentRoom) return;
    try {
      await removeMember.mutateAsync({ roomId: currentRoom.id, userId: memberId });
      message.success(`${memberName} удалён(а) из комнаты`);
      refetchRooms();
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  const handleLeave = async () => {
    if (!currentRoom) return;
    try {
      await leaveRoom.mutateAsync(currentRoom.id);
      message.success('Вы вышли из комнаты');
      clearRoom();
      navigate('/rooms');
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  const goBack = () => navigate(-1);

  return {
    currentRoom,
    isOwner,
    members,
    membersLoading,
    editName,
    editing,
    setEditing,
    setEditName,
    handleRename,
    handleRegenerate,
    handleCopy,
    handleKick,
    handleLeave,
    renamePending: updateRoom.isPending,
    regeneratePending: regenerateInvite.isPending,
    leavePending: leaveRoom.isPending,
    goBack,
  };
}