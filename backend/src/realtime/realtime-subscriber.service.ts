import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CHANNELS, REDIS_SUBSCRIBER } from '../redis/redis.constants';
import { RealtimeGateway } from './realtime.gateway';
import { OutboxRedisMessage } from './realtime-event.types';

@Injectable()
export class RealtimeSubscriberService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RealtimeSubscriberService.name);

  constructor(
    @Inject(REDIS_SUBSCRIBER)
    private readonly redisSubscriber: Redis,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async onModuleInit() {
    this.redisSubscriber.on('message', (channel, message) => {
      void this.handleRedisMessage(channel, message);
    });

    await this.redisSubscriber.subscribe(REDIS_CHANNELS.OUTBOX_EVENTS);

    this.logger.log(
      `Subscribed to Redis channel ${REDIS_CHANNELS.OUTBOX_EVENTS}`,
    );
  }

  async onModuleDestroy() {
    await this.redisSubscriber.unsubscribe(REDIS_CHANNELS.OUTBOX_EVENTS);
    this.redisSubscriber.removeAllListeners('message');
  }

  private handleRedisMessage(channel: string, message: string) {
    if (channel !== REDIS_CHANNELS.OUTBOX_EVENTS) {
      return;
    }

    try {
      const parsed = JSON.parse(message) as OutboxRedisMessage;
      this.routeEvent(parsed);
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : 'Unknown Redis parse error';

      this.logger.error(`Failed to handle Redis message: ${messageText}`);
    }
  }

  private routeEvent(message: OutboxRedisMessage) {
    switch (message.type) {
      case 'friend.request.created':
        this.handleFriendRequestCreated(message);
        return;

      case 'friend.request.accepted':
        this.handleFriendRequestAccepted(message);
        return;

      case 'friend.request.declined':
        this.handleFriendRequestDeclined(message);
        return;

      case 'friend.list.changed':
        this.handleFriendListChanged(message);
        return;

      default:
        return;
    }
  }

  private handleFriendRequestCreated(message: OutboxRedisMessage) {
    const receiverId = this.asString(message.payload.receiverId);
    const senderId = this.asString(message.payload.senderId);

    if (!receiverId || !senderId) {
      return;
    }

    this.realtimeGateway.emitToUser(receiverId, 'friend.request.created', {
      requestId: message.payload.requestId,
      senderId,
      receiverId,
      status: message.payload.status,
      createdAt: message.createdAt,
    });
  }

  private handleFriendRequestAccepted(message: OutboxRedisMessage) {
    const senderId = this.asString(message.payload.senderId);
    const receiverId = this.asString(message.payload.receiverId);

    if (!senderId || !receiverId) {
      return;
    }

    const outboundPayload = {
      requestId: message.payload.requestId,
      senderId,
      receiverId,
      status: message.payload.status,
      createdAt: message.createdAt,
    };

    this.realtimeGateway.emitToUser(
      senderId,
      'friend.request.accepted',
      outboundPayload,
    );
    this.realtimeGateway.emitToUser(
      receiverId,
      'friend.request.accepted',
      outboundPayload,
    );
  }

  private handleFriendRequestDeclined(message: OutboxRedisMessage) {
    const senderId = this.asString(message.payload.senderId);
    const receiverId = this.asString(message.payload.receiverId);

    if (!senderId || !receiverId) {
      return;
    }

    this.realtimeGateway.emitToUser(senderId, 'friend.request.declined', {
      requestId: message.payload.requestId,
      senderId,
      receiverId,
      status: message.payload.status,
      createdAt: message.createdAt,
    });
  }

  private handleFriendListChanged(message: OutboxRedisMessage) {
    const userId = this.asString(message.payload.userId);
    const friendId = this.asString(message.payload.friendId);

    if (!userId || !friendId) {
      return;
    }

    this.realtimeGateway.emitToUser(userId, 'friend.list.changed', {
      userId,
      friendId,
      reason: message.payload.reason,
      createdAt: message.createdAt,
    });
  }

  private asString(value: unknown): string | null {
    return typeof value === 'string' && value.length > 0 ? value : null;
  }
}
