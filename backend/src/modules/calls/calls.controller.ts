import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CallsService } from './calls.service.js';
import { CreateCallDto, UpdateCallDto, ListCallDto } from './dto/call.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('calls')
@UseGuards(JwtAuthGuard)
export class CallsController {
  constructor(private readonly service: CallsService) {}

  @Get() list(@Query() dto: ListCallDto) {
    return this.service.list(dto);
  }

  @Post() create(@Body() dto: CreateCallDto, @CurrentUser('id') userId: string) {
    return this.service.create(dto, userId);
  }

  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateCallDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id') remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
