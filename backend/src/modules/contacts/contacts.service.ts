import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto.js';
import { PaginationDto } from '../../common/dto/pagination.dto.js';

const CONTACT_SELECT = {
  id: true, name: true, phone: true, telegram: true,
  whatsapp: true, email: true, note: true, createdAt: true, updatedAt: true,
} as const;

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(dto: PaginationDto) {
    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 20;
    const [total, data] = await this.prisma.$transaction([
      this.prisma.contact.count(),
      this.prisma.contact.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: CONTACT_SELECT,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { data, meta: { page, pageSize, total } };
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id }, select: CONTACT_SELECT });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async create(dto: CreateContactDto) {
    return this.prisma.contact.create({ data: dto, select: CONTACT_SELECT });
  }

  async update(id: string, dto: UpdateContactDto) {
    await this.findOne(id);
    return this.prisma.contact.update({ where: { id }, data: dto, select: CONTACT_SELECT });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.contact.delete({ where: { id } });
    return { deleted: true };
  }
}
