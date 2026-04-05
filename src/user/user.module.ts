import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.providers';
import { UserControllers } from './user.controllers';
import { UserService } from './user.service';
import { UserRolesModule } from 'src/user-roles/user-roles.module';

@Module({
  providers: [UserService, ...userProviders],
  controllers: [UserControllers],
  imports: [DatabaseModule, UserRolesModule],
  exports: [UserService],
})
export class UserModule {}
