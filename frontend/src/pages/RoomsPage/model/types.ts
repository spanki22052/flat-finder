export type RoomsMode = 'create' | 'join';

export interface CreateRoomValues {
  name: string;
}

export interface JoinRoomValues {
  inviteCode: string;
}

export interface RoomsPageStats {
  totalRooms: number;
  totalOwners: number;
  totalPeople: number;
}