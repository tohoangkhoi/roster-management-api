import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from './constants';

export const DatabaseService: Provider = {
  provide: DATA_SOURCE,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const datasource = new DataSource({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT') || 5432,
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    });

    return datasource.initialize();
  },
};
