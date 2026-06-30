import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ParserService } from './parser.service.js';
import { ParseLinkDto } from './dto/parse-link.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('apartments')
@UseGuards(JwtAuthGuard)
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @Post('parse-link')
  async parseLink(@Body() dto: ParseLinkDto) {
    return this.parserService.parseLink(dto.url);
  }
}