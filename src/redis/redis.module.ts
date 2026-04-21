import { Module } from '@nestjs/common';
import { RedisService } from './redis-service.provider';
import { RedisClient } from './redis-client.provider';

@Module({
  providers: [RedisClient, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
