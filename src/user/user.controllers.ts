import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { Throttle } from '@nestjs/throttler';
import { BlockUserDTO } from 'src/auth/dto/manage-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { AssignRoleDTO } from 'src/auth/dto/assign-role.dto';
import { ROLE_INFORMATION } from 'src/user-roles/constants/user-roles-providers.constants';

@Controller('users')
export class UserControllers {
  constructor(private userService: UserService) {}

  @Get()
  async find(
    @Query() query: { start: number; limit: number },
  ): Promise<{ users: User[]; total: number }> {
    const { start, limit } = query || {};

    return this.userService.findAll(start, limit);
  }

  @Get('/:id')
  async findById(@Param() params: { id: number }): Promise<User | null> {
    const { id } = params || {};
    return this.userService.findOne({ id });
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post()
  async register(@Body() body: RegisterUserDTO): Promise<User> {
    return this.userService.registerUser(body);
  }

  @Roles([ROLE_INFORMATION.ADMIN.value])
  @Post('/block')
  async blockUser(@Body() body: BlockUserDTO) {
    return await this.userService.blockUser(body.id, body.blocked);
  }

  @Roles([ROLE_INFORMATION.ADMIN.value])
  @Post('/assignRole')
  async assignRole(@Body() body: AssignRoleDTO) {
    return this.userService.assignRole(body.userId, body.roleName);
  }
}
