import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { roleProviders } from './role.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [RoleService, ...roleProviders],
  imports: [DatabaseModule],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
