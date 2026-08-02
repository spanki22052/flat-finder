import type { User } from '@/shared/api/types';

export interface MemberStats {
  apartments: number;
  callbacks: number;
  viewings: number;
  done: number;
}

export interface SelfProfileState {
  user: User | null;
  loading: boolean;
  apartmentsTotal: number;
  remindersTotal: number;
}

export interface TeammateProfileState {
  user: User | null;
  loading: boolean;
  stats: MemberStats | null;
}

export interface SelfViewProps {
  user: User | null;
  loading: boolean;
  apartmentsTotal: number;
  remindersTotal: number;
  onReload: () => Promise<void>;
  onLogout: () => void;
  onOpenTeam: () => void;
}

export interface TeammateViewProps {
  user: User | null;
  loading: boolean;
  stats: MemberStats | null;
  onBack: () => void;
  onOpenTeam: () => void;
  currentRoomName?: string;
}
