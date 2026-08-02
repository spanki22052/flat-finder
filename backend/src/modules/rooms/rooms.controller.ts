import {
  Body, Controller, Delete, Get, Param, Patch, Post, UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';
import { JoinRoomDto } from './dto/join-room.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly service: RoomsService) {}

  @Get()
  list(@CurrentUser('id') userId: string) {
    return this.service.list(userId);
  }

  @Post()
  create(@Body() dto: CreateRoomDto, @CurrentUser('id') userId: string) {
    return this.service.create(dto, userId);
  }

  @Post('join')
  join(@Body() dto: JoinRoomDto, @CurrentUser('id') userId: string) {
    return this.service.join(dto, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRoomDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.service.update(id, dto, userId);
  }

  @Get(':id/members')
  members(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.members(id, userId);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') id: string,
    @Param('userId') targetUserId: string,
    @CurrentUser('id') actorId: string,
  ) {
    return this.service.removeMember(id, targetUserId, actorId);
  }

  @Post(':id/invite-code/regenerate')
  regenerateInviteCode(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.regenerateInviteCode(id, userId);
  }

  @Delete(':id/leave')
  leave(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.leave(id, userId);
  }
}
