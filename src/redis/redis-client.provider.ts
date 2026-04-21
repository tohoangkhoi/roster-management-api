import { Logger, Provider } from '@nestjs/common';
import { REDIS } from './redis.constants';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const RedisClient: Provider = {
  provide: REDIS,
  inject: [ConfigService, Logger],
  useFactory: async (configService: ConfigService, logger: Logger) => {
    const REDIS_HOST: string = configService.get('REDIS_HOST') || 'localhost';
    const REDIS_PORT: number = configService.get('REDIS_PORT') || 6379;
    const redis = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        //times: the number of tiems redis try to reconnect
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError: (error) => {
        /**
         * Read more in here: https://www.npmjs.com/package/ioredis
         */
        const targetError = 'READONLY';
        return error.message.includes(targetError) ? true : false;
      },
      autoResubscribe: true,
      lazyConnect: true,
    });
    redis.on('error', (error) => {
      logger.error('Redis error: ', error.stack);
    });
    await redis.connect().catch((error) => {
      logger.error(`Failed to connect to Redis: ${REDIS_HOST}:${REDIS_PORT}`);
      throw error;
    });
    return redis;
  },
};
