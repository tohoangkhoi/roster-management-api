import { Provider } from '@nestjs/common';
import { USER_ROLE_REPOSITORY } from './constants/user-roles-providers.constants';
import { DATA_SOURCE } from 'src/database/constants';
import { DataSource } from 'typeorm';
import { UserRole } from './user-roles.entity';

export const userRolesProviders: Provider[] = [
  {
    provide: USER_ROLE_REPOSITORY,
    inject: [DATA_SOURCE],
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserRole),
  },
];
