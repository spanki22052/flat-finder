import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { RemindersService } from './reminders.service.js';
import { CreateReminderDto, UpdateReminderDto, ListReminderDto } from './dto/reminder.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('reminders')
@UseGuards(JwtAuthGuard)
export class RemindersController {
  constructor(private readonly service: RemindersService) {}

  @Get() list(@Query() dto: ListReminderDto) {
    return this.service.list(dto);
  }

  @Post() create(@Body() dto: CreateReminderDto, @CurrentUser('id') userId: string) {
    return this.service.create(dto, userId);
  }

  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateReminderDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id') remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
