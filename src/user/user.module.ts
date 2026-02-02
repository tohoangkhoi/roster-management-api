import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.providers';
import { UserControllers } from './user.controllers';
import { UserService } from './user.service';

@Module({
  providers: [UserService, ...userProviders],
  controllers: [UserControllers],
  imports: [DatabaseModule],
})
export class UserModule {}
