import { IsUrl } from 'class-validator';

export class ParseLinkDto {
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'Некорректный URL' },
  )
  url!: string;
}