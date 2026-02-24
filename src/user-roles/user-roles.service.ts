import { Inject, Injectable } from '@nestjs/common';
import { USER_ROLE_REPOSITORY } from './constants/user-roles-providers.constants';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserRole } from './user-roles.entity';
import { formatErrorMessage } from 'src/utils/error.utils';

@Injectable()
export class UserRolesService {
  constructor(
    @Inject(USER_ROLE_REPOSITORY)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async findOne(where: FindOptionsWhere<UserRole>): Promise<UserRole | null> {
    if (!where) {
      throw new Error(
        formatErrorMessage(
          'UserRolesService-findOne',
          'Missing where parameters',
        ),
      );
    }

    const userRole = await this.userRoleRepository.findOne({ where });
    return userRole;
  }

  async create(userId: number, roleId: number): Promise<UserRole> {
    const existingUserRole = await this.findOne({ roleId, userId });
    if (existingUserRole) {
      throw new Error(
        formatErrorMessage('UserRolesService-create', 'Duplicated entity'),
      );
    }

    const userRole = await this.userRoleRepository.create({ roleId, userId });
    return this.userRoleRepository.save(userRole);
  }
}
