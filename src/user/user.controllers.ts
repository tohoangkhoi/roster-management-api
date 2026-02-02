import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import type { CreateUserDTO } from './dto/createUser.dto';

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
    return this.userService.findOne({ where: { id } });
  }

  @Post()
  async createUser(@Body() body: CreateUserDTO): Promise<User> {
    return this.userService.creatUser(body);
  }
}
