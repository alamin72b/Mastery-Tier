export type RealtimeOutboundEvent =
  | 'friend.request.created'
  | 'friend.request.accepted'
  | 'friend.request.declined'
  | 'friend.list.changed';

export type OutboxRedisMessage = {
  id: string;
  aggregate: string;
  aggregateId: string;
  type: RealtimeOutboundEvent;
  payload: Record<string, unknown>;
  createdAt: string;
};

export const userRoom = (userId: string) => `user:${userId}`;
