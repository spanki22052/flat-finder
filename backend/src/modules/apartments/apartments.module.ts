import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller.js';
import { ApartmentsService } from './apartments.service.js';
import { ParserModule } from './parser/parser.module.js';
import { RoomsModule } from '../rooms/rooms.module.js';

@Module({
  imports: [ParserModule, RoomsModule],
  controllers: [ApartmentsController],
  providers: [ApartmentsService],
  exports: [ApartmentsService],
})
export class ApartmentsModule {}