import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateReminderDto, UpdateReminderDto, ListReminderDto } from './dto/reminder.dto.js';
import { ReminderStatus, Prisma } from '@prisma/client';

const REMINDER_SELECT = {
  id: true, apartmentId: true, title: true, dueAt: true,
  status: true, assigneeId: true, createdAt: true, updatedAt: true,
  apartment: { select: { id: true, title: true, city: true } },
  assignee: { select: { id: true, name: true } },
} as const;

@Injectable()
export class RemindersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(dto: ListReminderDto) {
    const where: Prisma.ReminderWhereInput = {
      ...(dto.status && { status: dto.status }),
      ...(dto.assigneeId && { assigneeId: dto.assigneeId }),
      ...(dto.from || dto.to ? {
        dueAt: {
          ...(dto.from && { gte: new Date(dto.from) }),
          ...(dto.to && { lte: new Date(dto.to) }),
        },
      } : {}),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.reminder.count({ where }),
      this.prisma.reminder.findMany({
        where,
        select: REMINDER_SELECT,
        orderBy: { dueAt: 'asc' },
      }),
    ]);

    return { data, meta: { total } };
  }

  async create(dto: CreateReminderDto, userId: string) {
    return this.prisma.reminder.create({
      data: {
        ...dto,
        dueAt: new Date(dto.dueAt),
        assigneeId: dto.assigneeId ?? userId,
      },
      select: REMINDER_SELECT,
    });
  }

  async update(id: string, dto: UpdateReminderDto) {
    const reminder = await this.prisma.reminder.findUnique({ where: { id } });
    if (!reminder) throw new NotFoundException('Reminder not found');
    return this.prisma.reminder.update({
      where: { id },
      data: { ...dto, ...(dto.dueAt && { dueAt: new Date(dto.dueAt) }) } as Prisma.ReminderUpdateInput,
      select: REMINDER_SELECT,
    });
  }

  async remove(id: string) {
    const reminder = await this.prisma.reminder.findUnique({ where: { id } });
    if (!reminder) throw new NotFoundException('Reminder not found');
    await this.prisma.reminder.delete({ where: { id } });
    return { deleted: true };
  }
}
