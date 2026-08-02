import { Module } from '@nestjs/common';
import { ParserController } from './parser.controller.js';
import { ParserService } from './parser.service.js';
import { RoomsModule } from '../../rooms/rooms.module.js';

@Module({
  imports: [RoomsModule],
  controllers: [ParserController],
  providers: [ParserService],
  exports: [ParserService],
})
export class ParserModule {}