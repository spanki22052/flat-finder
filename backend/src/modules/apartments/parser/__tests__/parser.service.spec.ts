import { HttpStatus } from '@nestjs/common';
import { ParserService } from '../parser.service';
import { BaseListingParser, ParsedListing } from '../strategies/base.strategy';
import { ParserBlockedError, ParserInvalidPageError } from '../strategies/cian.strategy';

class StubParser extends BaseListingParser {
  readonly name = 'stub';
  readonly hostnamePattern = /(^|\.)stub\.example$/i;
  readonly result: ParsedListing | Error;

  constructor(result: ParsedListing | Error) {
    super();
    this.result = result;
  }

  async parse(): Promise<ParsedListing> {
    if (this.result instanceof Error) throw this.result;
    return this.result;
  }
}

const OFFER: ParsedListing = {
  source: 'LINK',
  sourceUrl: 'https://stub.example/x',
  title: 'Test',
  price: 1000,
  currency: 'RUB',
  city: 'Тюмень',
};

describe('ParserService', () => {
  it('throws 400 PARSER_UNSUPPORTED_SOURCE for unknown host', async () => {
    const svc = new ParserService();
    await expect(svc.parseLink('https://example.com/foo')).rejects.toMatchObject({
      status: HttpStatus.BAD_REQUEST,
      response: { code: 'PARSER_UNSUPPORTED_SOURCE' },
    });
  });

  it('returns parsed listing on success', async () => {
    const svc = new ParserService();
    (svc as unknown as { strategies: BaseListingParser[] }).strategies = [new StubParser(OFFER)];
    const result = await svc.parseLink('https://stub.example/x');
    expect(result).toEqual(OFFER);
  });

  it('maps ParserBlockedError to 502 PARSER_BLOCKED', async () => {
    const svc = new ParserService();
    (svc as unknown as { strategies: BaseListingParser[] }).strategies = [
      new StubParser(new ParserBlockedError('blocked')),
    ];
    await expect(svc.parseLink('https://stub.example/x')).rejects.toMatchObject({
      status: HttpStatus.BAD_GATEWAY,
      response: { code: 'PARSER_BLOCKED', message: expect.stringContaining('заблокировал') },
    });
  });

  it('maps ParserInvalidPageError to 422 PARSER_INVALID_PAGE', async () => {
    const svc = new ParserService();
    (svc as unknown as { strategies: BaseListingParser[] }).strategies = [
      new StubParser(new ParserInvalidPageError('no title')),
    ];
    await expect(svc.parseLink('https://stub.example/x')).rejects.toMatchObject({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      response: { code: 'PARSER_INVALID_PAGE', message: 'no title' },
    });
  });

  it('maps timeout to 504 PARSER_TIMEOUT', async () => {
    const slow = new (class extends BaseListingParser {
      readonly name = 'slow';
      readonly hostnamePattern = /(^|\.)stub\.example$/i;
      async parse(): Promise<ParsedListing> {
        return new Promise(() => { /* never resolves */ });
      }
    })();
    const svc = new ParserService();
    (svc as unknown as { strategies: BaseListingParser[] }).strategies = [slow];
    await expect(svc.parseLink('https://stub.example/x')).rejects.toMatchObject({
      status: HttpStatus.GATEWAY_TIMEOUT,
      response: { code: 'PARSER_TIMEOUT' },
    });
  }, 30_000);

  it('maps generic Error to 502 PARSER_FAILED', async () => {
    const svc = new ParserService();
    (svc as unknown as { strategies: BaseListingParser[] }).strategies = [
      new StubParser(new Error('boom')),
    ];
    await expect(svc.parseLink('https://stub.example/x')).rejects.toMatchObject({
      status: HttpStatus.BAD_GATEWAY,
      response: { code: 'PARSER_FAILED' },
    });
  });
});