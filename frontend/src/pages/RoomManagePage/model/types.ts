export interface RoomManageMemberItem {
  id: string;
  name: string;
  email?: string;
  role: 'OWNER' | 'MEMBER';
  isSelf: boolean;
  initials: string;
}