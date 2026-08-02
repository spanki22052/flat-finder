import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class RoomGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const roomId = request.headers['x-room-id'] as string | undefined;
    const userId = request.user?.id as string | undefined;

    if (!roomId) {
      throw new BadRequestException({
        code: 'ROOM_REQUIRED',
        message: 'Заголовок X-Room-Id обязателен',
      });
    }

    const membership = await this.prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId: userId ?? '' } },
    });

    if (!membership) {
      throw new ForbiddenException({
        code: 'ROOM_ACCESS_DENIED',
        message: 'Вы не состоите в этой комнате',
      });
    }

    request.roomId = roomId;
    return true;
  }
}
