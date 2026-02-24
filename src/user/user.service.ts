import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDTO } from './dto/register-user.dto';
import { USER_EXEPTION } from 'src/constants/errors/user';
import { hashPassword } from './utils/user.utils';
import { USER_REPOSITORY } from './constants/user-providers.constants';
import { UserRolesService } from 'src/user-roles/user-roles.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
    private roleService: RoleService,
    private userRoleService: UserRolesService,
  ) {}

  async findAll(
    start: number,
    limit: number,
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: start,
      take: limit,
    });
    return { users, total };
  }

  async findOne(where: FindOptionsWhere<User>): Promise<User | null> {
    if (!where) {
      throw new Error('Missing where parameters');
    }

    const user = await this.userRepository.findOne({ where });

    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.findOne({ id });
    if (!user) {
      throw new BadRequestException(USER_EXEPTION.USER_NOT_FOUND.message);
    } else {
      return user;
    }
  }

  async registerUser(body: RegisterUserDTO): Promise<User> {
    const { email, password } = body || {};
    const existingUser = await this.findOne({ email });
    if (existingUser) {
      throw new BadRequestException(USER_EXEPTION.DUPLICATED_USER.message);
    }

    const hashedPassword = await hashPassword(password);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async blockUser(userId: number, blocked: boolean) {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException(USER_EXEPTION.USER_NOT_FOUND.message);
    }
    const updatedResult = await this.userRepository.update(userId, { blocked });

    if (updatedResult.affected !== 1) {
      throw new BadRequestException(USER_EXEPTION.UPDATE_FAILED.message);
    }

    return true;
  }

  async assignRole(userId: number, roleId: number) {
    const user = await this.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const role = await this.roleService.findOne({ id: roleId });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.userRoleService.create(userId, roleId);
  }
}
