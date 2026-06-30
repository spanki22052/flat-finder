import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCallDto, UpdateCallDto, ListCallDto } from './dto/call.dto.js';
import { Prisma } from '@prisma/client';

const CALL_SELECT = {
  id: true, apartmentId: true, contactId: true, userId: true,
  calledAt: true, durationSec: true, outcome: true, notes: true, createdAt: true,
  apartment: { select: { id: true, title: true, city: true } },
  contact: { select: { id: true, name: true } },
} as const;

@Injectable()
export class CallsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(dto: ListCallDto) {
    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Prisma.CallWhereInput = {
      ...(dto.apartmentId && { apartmentId: dto.apartmentId }),
      ...(dto.userId && { userId: dto.userId }),
      ...(dto.from || dto.to ? {
        calledAt: {
          ...(dto.from && { gte: new Date(dto.from) }),
          ...(dto.to && { lte: new Date(dto.to) }),
        },
      } : {}),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.call.count({ where }),
      this.prisma.call.findMany({
        where, skip, take: pageSize,
        select: CALL_SELECT,
        orderBy: { calledAt: 'desc' },
      }),
    ]);

    return { data, meta: { page, pageSize, total } };
  }

  async create(dto: CreateCallDto, userId: string) {
    return this.prisma.call.create({
      data: { ...dto, userId },
      select: CALL_SELECT,
    });
  }

  async update(id: string, dto: UpdateCallDto) {
    const call = await this.prisma.call.findUnique({ where: { id } });
    if (!call) throw new NotFoundException('Call not found');
    return this.prisma.call.update({ where: { id }, data: dto, select: CALL_SELECT });
  }

  async remove(id: string) {
    const call = await this.prisma.call.findUnique({ where: { id } });
    if (!call) throw new NotFoundException('Call not found');
    await this.prisma.call.delete({ where: { id } });
    return { deleted: true };
  }
}
