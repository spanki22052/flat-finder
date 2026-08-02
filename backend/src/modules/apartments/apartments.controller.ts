import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApartmentsService } from './apartments.service.js';
import { CreateApartmentDto } from './dto/create-apartment.dto.js';
import { UpdateApartmentDto } from './dto/update-apartment.dto.js';
import { ListApartmentDto, UpdateTagsDto } from './dto/list-apartment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { RoomGuard } from '../rooms/guards/room.guard.js';
import { CurrentRoom } from '../rooms/decorators/current-room.decorator.js';

@Controller('apartments')
@UseGuards(JwtAuthGuard, RoomGuard)
export class ApartmentsController {
  constructor(private readonly service: ApartmentsService) {}

  @Get()
  list(@Query() dto: ListApartmentDto, @CurrentRoom() roomId: string) {
    return this.service.list(dto, roomId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentRoom() roomId: string) {
    return this.service.findOne(id, roomId);
  }

  @Get(':id/next-reminder')
  async getNextReminder(@Param('id') id: string, @CurrentRoom() roomId: string) {
    return this.service.getNextReminder(id, roomId);
  }

  @Post()
  create(
    @Body() dto: CreateApartmentDto,
    @CurrentUser('id') userId: string,
    @CurrentRoom() roomId: string,
  ) {
    return this.service.create(dto, userId, roomId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateApartmentDto,
    @CurrentRoom() roomId: string,
  ) {
    return this.service.update(id, dto, roomId);
  }

  @Patch(':id/tags')
  updateTags(
    @Param('id') id: string,
    @Body() dto: UpdateTagsDto,
    @CurrentRoom() roomId: string,
  ) {
    return this.service.updateTags(id, dto, roomId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentRoom() roomId: string) {
    return this.service.remove(id, roomId);
  }
}