import { HttpStatus } from '@nestjs/common';
import {
  Injectable,
  Logger,
  HttpException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseListingParser, ParsedListing } from './strategies/base.strategy.js';
import { ParserBlockedError, ParserInvalidPageError } from './strategies/cian.strategy.js';
import { CianParser } from './strategies/cian.strategy.js';
import { AvitoParser } from './strategies/avito.strategy.js';
import { YandexRealtyParser } from './strategies/yandex.strategy.js';
import { DomClickParser } from './strategies/domclick.strategy.js';

const TIMEOUT_MS = 35_000;

interface ParserErrorBody {
  code: string;
  message: string;
}

class ParserUpstreamException extends HttpException {
  constructor(code: string, message: string, status: HttpStatus) {
    super({ code, message } as ParserErrorBody, status);
  }
}

@Injectable()
export class ParserService {
  private readonly logger = new Logger(ParserService.name);
  private readonly strategies: BaseListingParser[];

  constructor() {
    this.strategies = [
      new CianParser(),
      new AvitoParser(),
      new YandexRealtyParser(),
      new DomClickParser(),
    ];
  }

  async parseLink(url: string): Promise<ParsedListing> {
    const strategy = this.strategies.find((s) => s.matches(url));
    if (!strategy) {
      throw new BadRequestException({
        code: 'PARSER_UNSUPPORTED_SOURCE',
        message: `URL не поддерживается. Поддерживаемые источники: ${this.strategies.map((s) => s.name).join(', ')}`,
      });
    }

    this.logger.log(`Parsing with strategy=${strategy.name}: ${url}`);

    try {
      return await this.withTimeout(strategy.parse(url), TIMEOUT_MS);
    } catch (err) {
      if (err instanceof ParserBlockedError) {
        throw new ParserUpstreamException(
          'PARSER_BLOCKED',
          'Сайт заблокировал парсинг. Попробуйте позже или заполните вручную.',
          HttpStatus.BAD_GATEWAY,
        );
      }
      if (err instanceof ParserInvalidPageError) {
        throw new UnprocessableEntityException({
          code: 'PARSER_INVALID_PAGE',
          message: err.message,
        } as ParserErrorBody);
      }
      if (err instanceof BadRequestException) throw err;
      if (err instanceof Error && /timeout/i.test(err.message)) {
        throw new ParserUpstreamException(
          'PARSER_TIMEOUT',
          'Не удалось загрузить страницу за отведённое время',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }
      this.logger.error(`Parser failed: ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
      throw new ParserUpstreamException(
        'PARSER_FAILED',
        'Не удалось разобрать страницу. Попробуйте позже.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('parser timeout')), ms);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}