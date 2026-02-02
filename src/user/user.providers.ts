import { DataSource } from 'typeorm';
import { USER_REPOSITORY } from './constants';
import { User } from './user.entity';
import { DATA_SOURCE } from 'src/database/constants';
import { Provider } from '@nestjs/common';

export const userProviders: Provider[] = [
  {
    provide: USER_REPOSITORY,
    inject: [DATA_SOURCE],
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  },
];
