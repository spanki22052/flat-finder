export type RoomRole = 'OWNER' | 'MEMBER';

export interface Room {
  id: string;
  name: string;
  inviteCode: string;
  role: RoomRole;
  membersCount: number;
  createdAt: string;
}

export interface RoomMember {
  id: string;
  name: string;
  email?: string;
  role: RoomRole;
  joinedAt: string;
}

export interface CreateRoomPayload {
  name: string;
}

export interface JoinRoomPayload {
  inviteCode: string;
}
