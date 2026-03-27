import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { OutboxProcessor } from './outbox.processor';
import { OutboxPublisher } from './outbox.publisher';
import { OutboxService } from './outbox.service';

@Module({
  imports: [RedisModule],
  providers: [OutboxService, OutboxPublisher, OutboxProcessor],
  exports: [OutboxService],
})
export class OutboxModule {}
