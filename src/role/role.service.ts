import { Inject, Injectable } from '@nestjs/common';
import { RoleValue } from './constants/roles.constants';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Role } from './role.entity';
import { formatErrorMessage } from 'src/utils/error.utils';
import { ROLE_REPOSITORY } from './constants/role-providers.constants';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private roleRepository: Repository<Role>,
  ) {}

  async findOne(where: FindOptionsWhere<Role>): Promise<Role | null> {
    if (!where) {
      throw new Error('Missing where parameters');
    }

    const role = await this.roleRepository.findOne({ where });

    return role;
  }

  async create(roleName: RoleValue, description?: string) {
    const existing = await this.findOne({ name: roleName });
    if (existing) {
      throw new Error(
        formatErrorMessage('RoleService-create', 'Duplicated entity'),
      );
    }

    const role = await this.roleRepository.create({
      name: roleName,
      description,
    });
    return this.roleRepository.save(role);
  }
}
