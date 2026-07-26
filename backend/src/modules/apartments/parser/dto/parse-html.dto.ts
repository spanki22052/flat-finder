import { IsIn, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export const HTML_PARSE_SOURCES = ['avito', 'domclick'] as const;
export type HtmlParseSource = (typeof HTML_PARSE_SOURCES)[number];

export class ParseHtmlDto {
  @IsIn(HTML_PARSE_SOURCES)
  source!: HtmlParseSource;

  @IsString()
  @MaxLength(2_000_000)
  html!: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'Некорректный URL' },
  )
  sourceUrl?: string;
}
