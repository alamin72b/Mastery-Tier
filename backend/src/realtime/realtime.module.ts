import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeSubscriberService } from './realtime-subscriber.service';

@Module({
  imports: [
    RedisModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [RealtimeGateway, RealtimeSubscriberService],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
