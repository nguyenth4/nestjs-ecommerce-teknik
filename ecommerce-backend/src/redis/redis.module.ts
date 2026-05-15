import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS = 'REDIS';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS,
      useFactory: (config: ConfigService) => {
        return new Redis({
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: +(config.get<string>('REDIS_PORT', '6379') || 6379),
          lazyConnect: true,
          maxRetriesPerRequest: 3,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
