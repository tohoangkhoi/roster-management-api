import { IsNumber, IsString } from 'class-validator';
import type { RoleValue } from '../constants/roles.constants';

export class CreateRoleDTO {
  @IsString({})
  role: RoleValue;

  @IsString()
  description?: string;
}
