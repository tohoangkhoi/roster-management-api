import { Provider } from '@nestjs/common';
import { ROLE_REPOSITORY } from './constants/role-providers.constants';
import { DATA_SOURCE } from 'src/database/constants';
import { DataSource } from 'typeorm';
import { Role } from './role.entity';

export const roleProviders: Provider[] = [
  {
    provide: ROLE_REPOSITORY,
    inject: [DATA_SOURCE],
    useFactory: (datasource: DataSource) => datasource.getRepository(Role),
  },
];
