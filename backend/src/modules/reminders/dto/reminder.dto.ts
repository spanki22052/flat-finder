import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ReminderStatus } from '@prisma/client';

export class CreateReminderDto {
  @IsOptional() @IsString() apartmentId?: string;
  @IsString() title!: string;
  @IsDateString() dueAt!: string;
  @IsOptional() @IsString() assigneeId?: string;
}

export class UpdateReminderDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsDateString() dueAt?: string;
  @IsOptional() @IsEnum(ReminderStatus) status?: ReminderStatus;
}

export class ListReminderDto {
  @IsOptional() @IsEnum(ReminderStatus) status?: ReminderStatus;
  @IsOptional() @IsString() assigneeId?: string;
  @IsOptional() @IsDateString() from?: string;
  @IsOptional() @IsDateString() to?: string;
}
