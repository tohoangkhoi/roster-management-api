import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { ROLE_VALUES } from 'src/user-roles/constants/user-roles-providers.constants';
import type { RoleValue } from 'src/user-roles/constants/user-roles-providers.constants';

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
  password?: string;

  @IsIn(ROLE_VALUES)
  @IsOptional()
  roleName?: RoleValue;
}
