import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  password: string;
}
