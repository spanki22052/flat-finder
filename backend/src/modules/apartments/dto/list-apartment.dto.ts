import { IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { ApartmentStatus } from '@prisma/client';
import { PaginationDto, SortDto } from '../../../common/dto/pagination.dto.js';

export class ListApartmentDto extends PaginationDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsEnum(ApartmentStatus) status?: ApartmentStatus;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() tag?: string;
  @IsOptional() @IsString() assigneeId?: string;
}

export class UpdateTagsDto {
  @IsArray() @IsString({ each: true }) tags!: string[];
}
