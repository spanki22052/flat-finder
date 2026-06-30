import { Module } from '@nestjs/common';
import { ParserController } from './parser.controller.js';
import { ParserService } from './parser.service.js';

@Module({
  controllers: [ParserController],
  providers: [ParserService],
  exports: [ParserService],
})
export class ParserModule {}