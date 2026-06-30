import { IsOptional, IsString, IsNumber, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CallOutcome } from '@prisma/client';

export class CreateCallDto {
  @IsString() apartmentId!: string;
  @IsOptional() @IsString() contactId?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) durationSec?: number;
  @IsEnum(CallOutcome) outcome!: CallOutcome;
  @IsOptional() @IsString() notes?: string;
}

export class UpdateCallDto {
  @IsOptional() @IsString() contactId?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) durationSec?: number;
  @IsOptional() @IsEnum(CallOutcome) outcome?: CallOutcome;
  @IsOptional() @IsString() notes?: string;
}

export class ListCallDto {
  @IsOptional() @IsString() apartmentId?: string;
  @IsOptional() @IsString() userId?: string;
  @IsOptional() @IsString() from?: string;
  @IsOptional() @IsString() to?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) pageSize?: number;
}
