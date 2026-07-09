import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateApartmentDto } from './dto/create-apartment.dto.js';
import { UpdateApartmentDto } from './dto/update-apartment.dto.js';
import { ListApartmentDto } from './dto/list-apartment.dto.js';
import { UpdateTagsDto } from './dto/list-apartment.dto.js';
import { ApartmentStatus, Prisma } from '@prisma/client';

const APARTMENT_SELECT = {
  id: true, title: true, source: true, sourceUrl: true, price: true,
  currency: true, city: true, district: true, address: true,
  rooms: true, area: true, floor: true, totalFloors: true,
  description: true, photos: true, phones: true, status: true,
  contactId: true, assigneeId: true, createdAt: true, updatedAt: true,
  tags: { select: { name: true } },
  contact: { select: { id: true, name: true, phone: true } },
  assignee: { select: { id: true, name: true } },
} satisfies Prisma.ApartmentSelect;

const REMINDER_SELECT = {
  id: true, apartmentId: true, title: true, dueAt: true,
  status: true, assigneeId: true, createdAt: true, updatedAt: true,
  apartment: { select: { id: true, title: true, city: true } },
  assignee: { select: { id: true, name: true } },
} as const;

@Injectable()
export class ApartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(dto: ListApartmentDto, userId: string) {
    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ApartmentWhereInput = {
      ...(dto.status && { status: dto.status }),
      ...(dto.city && { city: { contains: dto.city, mode: 'insensitive' } }),
      ...(dto.assigneeId && { assigneeId: dto.assigneeId }),
      ...(dto.q && {
        OR: [
          { title: { contains: dto.q, mode: 'insensitive' } },
          { city: { contains: dto.q, mode: 'insensitive' } },
          { district: { contains: dto.q, mode: 'insensitive' } },
          { description: { contains: dto.q, mode: 'insensitive' } },
        ],
      }),
      ...(dto.tag && {
        tags: { some: { name: { equals: dto.tag } } },
      }),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.apartment.count({ where }),
      this.prisma.apartment.findMany({
        where,
        skip,
        take: pageSize,
        select: APARTMENT_SELECT,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: items.map((a) => ({ ...a, tags: a.tags.map((t) => t.name) })),
      meta: { page, pageSize, total },
    };
  }

  async findOne(id: string) {
    const apartment = await this.prisma.apartment.findUnique({
      where: { id },
      select: APARTMENT_SELECT,
    });
    if (!apartment) throw new NotFoundException('Apartment not found');
    return { ...apartment, tags: apartment.tags.map((t) => t.name) };
  }

  async getNextReminder(id: string) {
    await this.findOne(id);
    return this.prisma.reminder.findFirst({
      where: {
        apartmentId: id,
        status: 'PENDING',
        dueAt: { gte: new Date() },
      },
      orderBy: { dueAt: 'asc' },
      select: REMINDER_SELECT,
    });
  }

  async create(dto: CreateApartmentDto, userId: string) {
    const { tags, ...data } = dto;

    const tagConnect = tags && tags.length > 0
      ? {
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        }
      : undefined;

    const apartment = await this.prisma.apartment.create({
      data: {
        ...data,
        assigneeId: data.assigneeId ?? userId,
        tags: tagConnect,
      },
      select: APARTMENT_SELECT,
    });

    return { ...apartment, tags: apartment.tags.map((t) => t.name) };
  }

  async update(id: string, dto: UpdateApartmentDto) {
    await this.findOne(id);
    const apartment = await this.prisma.apartment.update({
      where: { id },
      data: dto as Parameters<typeof this.prisma.apartment.update>[0]['data'],
      select: APARTMENT_SELECT,
    });
    return { ...apartment, tags: apartment.tags.map((t) => t.name) };
  }

  async updateTags(id: string, dto: UpdateTagsDto) {
    await this.findOne(id);
    const apartment = await this.prisma.apartment.update({
      where: { id },
      data: {
        tags: {
          set: [],
          connectOrCreate: dto.tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      select: APARTMENT_SELECT,
    });
    return { ...apartment, tags: apartment.tags.map((t) => t.name) };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.apartment.delete({ where: { id } });
    return { deleted: true };
  }
}
