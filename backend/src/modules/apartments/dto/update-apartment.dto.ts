import { IsOptional, IsString, IsNumber, IsEnum, Min, IsArray } from 'class-validator';
import { ApartmentSource, ApartmentStatus, Currency } from '@prisma/client';

export class UpdateApartmentDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsEnum(ApartmentSource) source?: ApartmentSource;
  @IsOptional() @IsString() sourceUrl?: string;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsEnum(Currency) currency?: Currency;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsNumber() @Min(0) rooms?: number;
  @IsOptional() @IsNumber() @Min(0) area?: number;
  @IsOptional() @IsNumber() @Min(0) floor?: number;
  @IsOptional() @IsNumber() @Min(0) totalFloors?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) photos?: string[];
  @IsOptional() @IsEnum(ApartmentStatus) status?: ApartmentStatus;
  @IsOptional() @IsString() contactId?: string;
  @IsOptional() @IsString() assigneeId?: string;
}
