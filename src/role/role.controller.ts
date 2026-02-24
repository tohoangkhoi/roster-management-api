import { RoleService } from './role.service';
import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLE_INFORMATION } from './constants/roles.constants';
import { CreateRoleDTO } from './dto/create-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Roles([ROLE_INFORMATION.ADMIN.value])
  @Post('/')
  async create(@Body() body: CreateRoleDTO) {
    return this.roleService.create(body.role, body.description);
  }
}
