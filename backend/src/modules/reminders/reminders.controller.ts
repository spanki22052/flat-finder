import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { RemindersService } from './reminders.service.js';
import { CreateReminderDto, UpdateReminderDto, ListReminderDto } from './dto/reminder.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { RoomGuard } from '../rooms/guards/room.guard.js';
import { CurrentRoom } from '../rooms/decorators/current-room.decorator.js';

@Controller('reminders')
@UseGuards(JwtAuthGuard, RoomGuard)
export class RemindersController {
  constructor(private readonly service: RemindersService) {}

  @Get() list(@Query() dto: ListReminderDto, @CurrentRoom() roomId: string) {
    return this.service.list(dto, roomId);
  }

  @Post() create(
    @Body() dto: CreateReminderDto,
    @CurrentUser('id') userId: string,
    @CurrentRoom() roomId: string,
  ) {
    return this.service.create(dto, userId, roomId);
  }

  @Patch(':id') update(
    @Param('id') id: string,
    @Body() dto: UpdateReminderDto,
    @CurrentRoom() roomId: string,
  ) {
    return this.service.update(id, dto, roomId);
  }

  @Delete(':id') remove(@Param('id') id: string, @CurrentRoom() roomId: string) {
    return this.service.remove(id, roomId);
  }
}
