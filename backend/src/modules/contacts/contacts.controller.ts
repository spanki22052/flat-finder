import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service.js';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PaginationDto } from '../../common/dto/pagination.dto.js';
import { RoomGuard } from '../rooms/guards/room.guard.js';
import { CurrentRoom } from '../rooms/decorators/current-room.decorator.js';

@Controller('contacts')
@UseGuards(JwtAuthGuard, RoomGuard)
export class ContactsController {
  constructor(private readonly service: ContactsService) {}

  @Get() list(@Query() dto: PaginationDto, @CurrentRoom() roomId: string) {
    return this.service.list(dto, roomId);
  }

  @Get(':id') findOne(@Param('id') id: string, @CurrentRoom() roomId: string) {
    return this.service.findOne(id, roomId);
  }

  @Post() create(@Body() dto: CreateContactDto, @CurrentRoom() roomId: string) {
    return this.service.create(dto, roomId);
  }

  @Patch(':id') update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
    @CurrentRoom() roomId: string,
  ) {
    return this.service.update(id, dto, roomId);
  }

  @Delete(':id') remove(@Param('id') id: string, @CurrentRoom() roomId: string) {
    return this.service.remove(id, roomId);
  }
}
