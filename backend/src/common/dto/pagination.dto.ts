import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}

export class SortDto {
  @IsOptional()
  @IsString()
  sort?: string; // e.g. "createdAt:desc"
}

export function parseSortParam(sort?: string): {
  field: string;
  order: 'asc' | 'desc';
} | null {
  if (!sort) return null;
  const [field, order] = sort.split(':');
  return {
    field: field ?? 'createdAt',
    order: order === 'desc' ? 'desc' : 'asc',
  };
}
