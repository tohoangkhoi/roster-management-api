import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
