export const OUTBOX_EVENT_TYPES = {
  FRIEND_REQUEST_CREATED: 'friend.request.created',
  FRIEND_REQUEST_ACCEPTED: 'friend.request.accepted',
  FRIEND_REQUEST_DECLINED: 'friend.request.declined',
  FRIEND_LIST_CHANGED: 'friend.list.changed',
} as const;

export type OutboxEventType =
  (typeof OUTBOX_EVENT_TYPES)[keyof typeof OUTBOX_EVENT_TYPES];

export type OutboxEventInput = {
  aggregate: string;
  aggregateId: string;
  type: OutboxEventType;
  payload: Record<string, unknown>;
};
