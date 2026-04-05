import { IsIn, IsNumber } from 'class-validator';
import { ROLE_VALUES } from 'src/user-roles/constants/user-roles-providers.constants';
import type { RoleValue } from 'src/user-roles/constants/user-roles-providers.constants';

export class AssignRoleDTO {
  @IsNumber()
  userId: number;

  @IsIn([ROLE_VALUES])
  roleName: RoleValue;
}
