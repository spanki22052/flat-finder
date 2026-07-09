import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApartmentsService } from './apartments.service.js';
import { CreateApartmentDto } from './dto/create-apartment.dto.js';
import { UpdateApartmentDto } from './dto/update-apartment.dto.js';
import { ListApartmentDto, UpdateTagsDto } from './dto/list-apartment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('apartments')
@UseGuards(JwtAuthGuard)
export class ApartmentsController {
  constructor(private readonly service: ApartmentsService) {}

  @Get()
  list(@Query() dto: ListApartmentDto, @CurrentUser('id') userId: string) {
    return this.service.list(dto, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/next-reminder')
  async getNextReminder(@Param('id') id: string) {
    return this.service.getNextReminder(id);
  }

  @Post()
  create(@Body() dto: CreateApartmentDto, @CurrentUser('id') userId: string) {
    return this.service.create(dto, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateApartmentDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/tags')
  updateTags(@Param('id') id: string, @Body() dto: UpdateTagsDto) {
    return this.service.updateTags(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}