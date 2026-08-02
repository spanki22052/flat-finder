import type { RoomMember } from '@/entities/Room/model/types';

export interface EditFormValues {
  name: string;
  email?: string;
}

export interface AvatarTone {
  from: string;
  to: string;
}

export const AVATAR_TONES: AvatarTone[] = [
  { from: '#b55b3b', to: '#7a2f12' },
  { from: '#9b6a2b', to: '#5c3a14' },
  { from: '#4f7a52', to: '#2c4630' },
  { from: '#3d6b8a', to: '#1f3f55' },
  { from: '#8a4d3d', to: '#5c2c20' },
  { from: '#645e4f', to: '#3b3729' },
];

export interface MemberActionsProps {
  isOwner: boolean;
  isSelf: boolean;
  isMemberOwner: boolean;
  m: RoomMember;
  navigate: (path: string) => void;
  onEdit: () => void;
  onKick: () => void;
  onLeave: () => void;
}

export interface EditProfileModalProps {
  open: boolean;
  onCancel: () => void;
  user?: { name: string; email?: string } | null;
}