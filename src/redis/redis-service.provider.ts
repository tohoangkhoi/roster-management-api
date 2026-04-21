import { Inject, Injectable } from '@nestjs/common';
import { REDIS } from './redis.constants';
import Redis from 'ioredis';
import { cast } from 'src/utils/common.utils';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS)
    private client: Redis,
  ) {}

  getClient() {
    return this.client;
  }

  async setJson(key: string, value: Record<string, any>) {
    await this.client.call('JSON.SET', key, '$', JSON.stringify(value));
  }

  async getJson(key: string) {
    try {
      const result = await this.client.call('JSON.GET', key);
      return JSON.parse(cast<string>(result)) as Record<string, any>;
    } catch {
      return {};
    }
  }
}
