import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';
import { JoinRoomDto } from './dto/join-room.dto.js';

const ROOM_SELECT = {
  id: true,
  name: true,
  inviteCode: true,
  createdAt: true,
} as const;

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const memberships = await this.prisma.roomMember.findMany({
      where: { userId },
      select: {
        role: true,
        room: {
          select: { ...ROOM_SELECT, _count: { select: { members: true } } },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    return memberships.map((m) => ({
      id: m.room.id,
      name: m.room.name,
      inviteCode: m.room.inviteCode,
      createdAt: m.room.createdAt,
      role: m.role,
      membersCount: m.room._count.members,
    }));
  }

  async create(dto: CreateRoomDto, userId: string) {
    const room = await this.prisma.room.create({
      data: {
        name: dto.name,
        inviteCode: await this.generateUniqueInviteCode(),
        members: { create: [{ userId, role: 'OWNER' }] },
      },
      select: { ...ROOM_SELECT, _count: { select: { members: true } } },
    });

    return {
      id: room.id,
      name: room.name,
      inviteCode: room.inviteCode,
      createdAt: room.createdAt,
      role: 'OWNER' as const,
      membersCount: room._count.members,
    };
  }

  async join(dto: JoinRoomDto, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { inviteCode: dto.inviteCode },
    });
    if (!room) {
      throw new NotFoundException({
        code: 'ROOM_NOT_FOUND',
        message: 'Комната с таким кодом не найдена',
      });
    }

    const existing = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId: room.id, userId } },
    });
    if (existing) {
      throw new ConflictException({
        code: 'ROOM_ALREADY_MEMBER',
        message: 'Вы уже состоите в этой комнате',
      });
    }

    await this.prisma.roomMember.create({
      data: { roomId: room.id, userId, role: 'MEMBER' },
    });

    const membersCount = await this.prisma.roomMember.count({
      where: { roomId: room.id },
    });

    return {
      id: room.id,
      name: room.name,
      inviteCode: room.inviteCode,
      createdAt: room.createdAt,
      role: 'MEMBER' as const,
      membersCount,
    };
  }

  async findOne(roomId: string, userId: string) {
    const membership = await this.requireMembership(roomId, userId);
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { ...ROOM_SELECT, _count: { select: { members: true } } },
    });
    if (!room) {
      throw new NotFoundException({ code: 'ROOM_NOT_FOUND', message: 'Комната не найдена' });
    }

    return {
      id: room.id,
      name: room.name,
      inviteCode: room.inviteCode,
      createdAt: room.createdAt,
      role: membership.role,
      membersCount: room._count.members,
    };
  }

  async update(roomId: string, dto: UpdateRoomDto, userId: string) {
    const membership = await this.requireMembership(roomId, userId);
    if (membership.role !== 'OWNER') {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Только владелец может изменить название комнаты',
      });
    }

    const room = await this.prisma.room.update({
      where: { id: roomId },
      data: { name: dto.name },
      select: { ...ROOM_SELECT, _count: { select: { members: true } } },
    });

    return {
      id: room.id,
      name: room.name,
      inviteCode: room.inviteCode,
      createdAt: room.createdAt,
      role: membership.role,
      membersCount: room._count.members,
    };
  }

  async members(roomId: string, userId: string) {
    await this.requireMembership(roomId, userId);
    const members = await this.prisma.roomMember.findMany({
      where: { roomId },
      select: {
        role: true,
        joinedAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { joinedAt: 'asc' },
    });

    return members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      joinedAt: m.joinedAt,
    }));
  }

  async removeMember(roomId: string, targetUserId: string, actorId: string) {
    const actorMembership = await this.requireMembership(roomId, actorId);
    if (actorMembership.role !== 'OWNER') {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Только владелец может удалять участников',
      });
    }
    if (targetUserId === actorId) {
      throw new ConflictException({
        code: 'ROOM_OWNER_CANNOT_LEAVE',
        message: 'Владелец не может выгнать сам себя',
      });
    }

    const target = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId: targetUserId } },
    });
    if (!target) {
      throw new NotFoundException({
        code: 'ROOM_NOT_FOUND',
        message: 'Участник не найден в этой комнате',
      });
    }

    await this.prisma.roomMember.delete({ where: { id: target.id } });
    return { removed: true };
  }

  async regenerateInviteCode(roomId: string, userId: string) {
    const membership = await this.requireMembership(roomId, userId);
    if (membership.role !== 'OWNER') {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Только владелец может перегенерировать код приглашения',
      });
    }

    const room = await this.prisma.room.update({
      where: { id: roomId },
      data: { inviteCode: await this.generateUniqueInviteCode() },
      select: { ...ROOM_SELECT, _count: { select: { members: true } } },
    });

    return {
      id: room.id,
      name: room.name,
      inviteCode: room.inviteCode,
      createdAt: room.createdAt,
      role: membership.role,
      membersCount: room._count.members,
    };
  }

  async leave(roomId: string, userId: string) {
    const membership = await this.requireMembership(roomId, userId);
    if (membership.role === 'OWNER') {
      throw new ConflictException({
        code: 'ROOM_OWNER_CANNOT_LEAVE',
        message: 'Владелец не может выйти из своей комнаты',
      });
    }

    await this.prisma.roomMember.delete({ where: { id: membership.id } });
    return { left: true };
  }

  private async requireMembership(roomId: string, userId: string) {
    const membership = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException({
        code: 'ROOM_ACCESS_DENIED',
        message: 'Вы не состоите в этой комнате',
      });
    }
    return membership;
  }

  private async generateUniqueInviteCode(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = randomBytes(4).toString('hex').toUpperCase();
      const existing = await this.prisma.room.findUnique({ where: { inviteCode: code } });
      if (!existing) return code;
    }
    throw new Error('Failed to generate a unique invite code');
  }
}
