import { Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { userRolesProviders } from './user-roles.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [UserRolesService, ...userRolesProviders],
  imports: [DatabaseModule],
  exports: [UserRolesService],
})
export class UserRolesModule {}
