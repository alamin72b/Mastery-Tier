import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_PUBLISHER, REDIS_SUBSCRIBER } from './redis.constants';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_PUBLISHER,
      useFactory: () => {
        const redisUrl = process.env.REDIS_URL;

        if (!redisUrl) {
          throw new Error('REDIS_URL is not set');
        }

        return new Redis(redisUrl, {
          maxRetriesPerRequest: null,
          enableReadyCheck: true,
        });
      },
    },
    {
      provide: REDIS_SUBSCRIBER,
      useFactory: () => {
        const redisUrl = process.env.REDIS_URL;

        if (!redisUrl) {
          throw new Error('REDIS_URL is not set');
        }

        return new Redis(redisUrl, {
          maxRetriesPerRequest: null,
          enableReadyCheck: true,
        });
      },
    },
  ],
  exports: [REDIS_PUBLISHER, REDIS_SUBSCRIBER],
})
export class RedisModule {}
