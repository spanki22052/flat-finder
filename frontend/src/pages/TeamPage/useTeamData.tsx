import { useEffect, useMemo, useState, useCallback, createContext, useContext } from 'react';
import { message } from 'antd';
import { useAuth } from '../../app/providers/AuthProvider';
import { useRoom } from '../../app/providers/RoomProvider';
import {
  useGetRoomMembers,
  useRemoveRoomMember,
  useLeaveRoom,
  useRegenerateInviteCode,
} from '../../entities/Room/hooks/useRooms';
import type { RoomMember } from '../../entities/Room/model/types';
import { remindersApi } from '../../shared/api/endpoints';
import { apiClient, getApiError } from '../../shared/api/client';

export interface MemberStats {
  apartments: number;
  callbacks: number;
  viewings: number;
}

export interface TeamMember extends RoomMember {
  stats?: MemberStats;
  loadingStats?: boolean;
}

export type RoleFilter = 'all' | 'owner' | 'member';

async function fetchMemberStats(userId: string): Promise<MemberStats> {
  const [aptRes, pendingReminders] = await Promise.all([
    apiClient
      .get<{ data: Array<{ status: string }>; meta: { total: number } }>(`/apartments`, {
        params: { assigneeId: userId, pageSize: 100 },
      })
      .then((r) => ({
        total: r.data.meta?.total ?? 0,
        items: r.data.data ?? [],
      })),
    remindersApi.list({ assigneeId: userId, status: 'PENDING' }).then((r) => r.data.data ?? []),
  ]);
  const items = aptRes.items;
  const callbacks = items.filter((a) => a.status === 'CALLBACK').length;
  const viewings = items.filter((a) => a.status === 'VIEWING').length;
  void pendingReminders;
  return { apartments: aptRes.total, callbacks, viewings };
}

export interface TeamData {
  user: ReturnType<typeof useAuth>['user'];
  refreshAuth: ReturnType<typeof useAuth>['refresh'];
  currentRoom: ReturnType<typeof useRoom>['currentRoom'];
  isOwner: boolean;
  members: RoomMember[];
  membersLoading: boolean;
  filtered: TeamMember[];
  teamTotals: { apartments: number; callbacks: number; viewings: number; owners: number };
  ownerCount: number;
  memberCount: number;
  search: string;
  setSearch: (v: string) => void;
  roleFilter: RoleFilter;
  setRoleFilter: (v: RoleFilter) => void;
  copyInvite: () => Promise<void>;
  handleRegenerate: () => Promise<void>;
  regeneratePending: boolean;
  handleKick: (m: RoomMember) => Promise<void>;
  handleLeave: () => Promise<void>;
  editOpen: boolean;
  setEditOpen: (v: boolean) => void;
  submitEdit: (values: { name: string; email?: string }) => Promise<void>;
}

const TeamDataContext = createContext<TeamData | null>(null);

export function useTeamData(): TeamData {
  const ctx = useContext(TeamDataContext);
  if (!ctx) throw new Error('useTeamData must be used within TeamDataProvider');
  return ctx;
}

export function TeamDataProvider({ children }: { children: React.ReactNode }) {
  const { user, refresh: refreshAuth } = useAuth();
  const { currentRoom, refetchRooms } = useRoom();
  const roomId = currentRoom?.id ?? '';
  const isOwner = currentRoom?.role === 'OWNER';

  const { data: members = [], isLoading: membersLoading } = useGetRoomMembers(roomId);
  const removeMember = useRemoveRoomMember();
  const leaveRoom = useLeaveRoom();
  const regenerateInvite = useRegenerateInviteCode();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [stats, setStats] = useState<Record<string, MemberStats>>({});
  const [loadingStatsFor, setLoadingStatsFor] = useState<Set<string>>(new Set());
  const [editOpen, setEditOpen] = useState(false);

  const ensureStats = useCallback(async (m: RoomMember) => {
    setStats((prev) => {
      if (prev[m.id]) return prev;
      return prev;
    });
    setLoadingStatsFor((prev) => {
      if (prev.has(m.id)) return prev;
      const next = new Set(prev);
      next.add(m.id);
      return next;
    });
    try {
      const s = await fetchMemberStats(m.id);
      setStats((prev) => ({ ...prev, [m.id]: s }));
    } catch {
      setStats((prev) => ({ ...prev, [m.id]: { apartments: 0, callbacks: 0, viewings: 0 } }));
    } finally {
      setLoadingStatsFor((prev) => {
        const next = new Set(prev);
        next.delete(m.id);
        return next;
      });
    }
  }, []);

  useEffect(() => {
    members.forEach((m) => { void ensureStats(m); });
  }, [members, ensureStats]);

  const filtered = useMemo<TeamMember[]>(() => {
    const q = search.trim().toLowerCase();
    return members
      .filter((m) => {
        if (roleFilter === 'owner' && m.role !== 'OWNER') return false;
        if (roleFilter === 'member' && m.role !== 'MEMBER') return false;
        if (!q) return true;
        return (
          m.name.toLowerCase().includes(q) ||
          (m.email ?? '').toLowerCase().includes(q)
        );
      })
      .map((m) => ({ ...m, stats: stats[m.id], loadingStats: loadingStatsFor.has(m.id) }))
      .sort((a, b) => {
        if (a.role !== b.role) return a.role === 'OWNER' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [members, search, roleFilter, stats, loadingStatsFor]);

  const ownerCount = members.filter((m) => m.role === 'OWNER').length;
  const memberCount = members.length - ownerCount;

  const teamTotals = useMemo(() => {
    const values = Object.values(stats);
    return {
      apartments: values.reduce((a, s) => a + s.apartments, 0),
      callbacks: values.reduce((a, s) => a + s.callbacks, 0),
      viewings: values.reduce((a, s) => a + s.viewings, 0),
      owners: ownerCount,
    };
  }, [stats, ownerCount]);

  const copyInvite = useCallback(async () => {
    if (!currentRoom) return;
    try {
      await navigator.clipboard.writeText(currentRoom.inviteCode);
      message.success('Код скопирован');
    } catch {
      message.error('Не удалось скопировать');
    }
  }, [currentRoom]);

  const handleRegenerate = useCallback(async () => {
    if (!currentRoom) return;
    try {
      await regenerateInvite.mutateAsync(currentRoom.id);
      message.success('Новый код сгенерирован');
      refetchRooms();
    } catch (err) {
      message.error(getApiError(err).message);
    }
  }, [currentRoom, regenerateInvite, refetchRooms]);

  const handleKick = useCallback(
    async (m: RoomMember) => {
      if (!currentRoom) return;
      try {
        await removeMember.mutateAsync({ roomId: currentRoom.id, userId: m.id });
        message.success(`${m.name} удалён(а) из команды`);
        refetchRooms();
        setStats((prev) => {
          const { [m.id]: _, ...rest } = prev;
          return rest;
        });
      } catch (err) {
        message.error(getApiError(err).message);
      }
    },
    [currentRoom, removeMember, refetchRooms],
  );

  const handleLeave = useCallback(async () => {
    if (!currentRoom) return;
    try {
      await leaveRoom.mutateAsync(currentRoom.id);
      message.success('Вы вышли из комнаты');
    } catch (err) {
      message.error(getApiError(err).message);
    }
  }, [currentRoom, leaveRoom]);

  const submitEdit = useCallback(
    async (values: { name: string; email?: string }) => {
      try {
        await apiClient.patch(`/users/${user?.id}`, {
          name: values.name.trim(),
          email: values.email?.trim() || undefined,
        });
        message.success('Профиль обновлён');
        setEditOpen(false);
        await refreshAuth();
      } catch (err) {
        message.error(getApiError(err).message);
        throw err;
      }
    },
    [user?.id, refreshAuth],
  );

  const value: TeamData = {
    user,
    refreshAuth,
    currentRoom,
    isOwner,
    members,
    membersLoading,
    filtered,
    teamTotals,
    ownerCount,
    memberCount,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    copyInvite,
    handleRegenerate,
    regeneratePending: regenerateInvite.isPending,
    handleKick,
    handleLeave,
    editOpen,
    setEditOpen,
    submitEdit,
  };

  return <TeamDataContext.Provider value={value}>{children}</TeamDataContext.Provider>;
}