import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  login!: string;

  @IsString()
  password!: string;
}
