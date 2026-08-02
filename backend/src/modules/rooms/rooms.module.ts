import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller.js';
import { RoomsService } from './rooms.service.js';
import { RoomGuard } from './guards/room.guard.js';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, RoomGuard],
  exports: [RoomsService, RoomGuard],
})
export class RoomsModule {}
