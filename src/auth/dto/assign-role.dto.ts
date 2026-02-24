import { IsNumber } from 'class-validator';

export class AssignRoleDTO {
  @IsNumber()
  userId: number;

  @IsNumber()
  roleId: number;
}
