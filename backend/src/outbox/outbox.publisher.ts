import { Inject, Injectable, Logger } from '@nestjs/common';
import { OutboxEvent } from '@prisma/client';
import Redis from 'ioredis';
import { REDIS_CHANNELS, REDIS_PUBLISHER } from '../redis/redis.constants';

@Injectable()
export class OutboxPublisher {
  private readonly logger = new Logger(OutboxPublisher.name);

  constructor(
    @Inject(REDIS_PUBLISHER)
    private readonly redisPublisher: Redis,
  ) {}

  async publish(event: OutboxEvent): Promise<void> {
    const message = JSON.stringify({
      id: event.id,
      aggregate: event.aggregate,
      aggregateId: event.aggregateId,
      type: event.type,
      payload: event.payload,
      createdAt: event.createdAt.toISOString(),
    });

    await this.redisPublisher.publish(REDIS_CHANNELS.OUTBOX_EVENTS, message);

    this.logger.log(
      `Published outbox event type=${event.type} aggregate=${event.aggregate} aggregateId=${event.aggregateId}`,
    );
  }
}
