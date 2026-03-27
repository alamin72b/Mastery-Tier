import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FriendRequestStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxService } from '../outbox/outbox.service';
import { OUTBOX_EVENT_TYPES } from '../outbox/outbox-event.types';

@Injectable()
export class FriendsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outboxService: OutboxService,
  ) {}

  async searchUsersByEmail(currentUserId: string, query: string) {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      return [];
    }

    const users = await this.prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        email: { contains: normalizedQuery, mode: 'insensitive' },
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
      orderBy: { email: 'asc' },
      take: 10,
    });

    const userIds = users.map((user) => user.id);

    const [existingFriends, pendingRequests] = await Promise.all([
      this.prisma.friend.findMany({
        where: {
          userId: currentUserId,
          friendId: { in: userIds },
        },
        select: { friendId: true },
      }),
      this.prisma.friendRequest.findMany({
        where: {
          status: FriendRequestStatus.PENDING,
          OR: [
            { senderId: currentUserId, receiverId: { in: userIds } },
            { receiverId: currentUserId, senderId: { in: userIds } },
          ],
        },
        select: { senderId: true, receiverId: true },
      }),
    ]);

    const friendIds = new Set(existingFriends.map((friend) => friend.friendId));
    const outgoingIds = new Set(
      pendingRequests
        .filter((request) => request.senderId === currentUserId)
        .map((request) => request.receiverId),
    );
    const incomingIds = new Set(
      pendingRequests
        .filter((request) => request.receiverId === currentUserId)
        .map((request) => request.senderId),
    );

    return users.map((user) => ({
      ...user,
      isFriend: friendIds.has(user.id),
      hasOutgoingRequest: outgoingIds.has(user.id),
      hasIncomingRequest: incomingIds.has(user.id),
    }));
  }

  async sendFriendRequest(senderId: string, email: string) {
    const receiver = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true, email: true, name: true },
    });

    if (!receiver) {
      throw new NotFoundException('No user found with that email address');
    }

    if (receiver.id === senderId) {
      throw new BadRequestException(
        'You cannot send a friend request to yourself',
      );
    }

    const [existingFriendship, existingRequest, reversePendingRequest] =
      await Promise.all([
        this.prisma.friend.findUnique({
          where: {
            userId_friendId: {
              userId: senderId,
              friendId: receiver.id,
            },
          },
        }),
        this.prisma.friendRequest.findUnique({
          where: {
            senderId_receiverId: {
              senderId,
              receiverId: receiver.id,
            },
          },
        }),
        this.prisma.friendRequest.findUnique({
          where: {
            senderId_receiverId: {
              senderId: receiver.id,
              receiverId: senderId,
            },
          },
        }),
      ]);

    if (existingFriendship) {
      throw new ConflictException('This user is already in your friend list');
    }

    if (existingRequest?.status === FriendRequestStatus.PENDING) {
      throw new ConflictException('A friend request is already pending');
    }

    if (reversePendingRequest?.status === FriendRequestStatus.PENDING) {
      throw new ConflictException(
        'This user already sent you a request. Accept it from your inbox.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const friendRequest = await tx.friendRequest.upsert({
        where: {
          senderId_receiverId: {
            senderId,
            receiverId: receiver.id,
          },
        },
        update: { status: FriendRequestStatus.PENDING },
        create: {
          senderId,
          receiverId: receiver.id,
        },
        include: {
          receiver: {
            select: { id: true, email: true, name: true },
          },
        },
      });

      await this.outboxService.enqueue(
        {
          aggregate: 'FriendRequest',
          aggregateId: friendRequest.id,
          type: OUTBOX_EVENT_TYPES.FRIEND_REQUEST_CREATED,
          payload: {
            requestId: friendRequest.id,
            senderId: friendRequest.senderId,
            receiverId: friendRequest.receiverId,
            status: friendRequest.status,
          },
        },
        tx,
      );

      return friendRequest;
    });
  }

  async getPendingRequests(userId: string) {
    const [incoming, outgoing] = await Promise.all([
      this.prisma.friendRequest.findMany({
        where: {
          receiverId: userId,
          status: FriendRequestStatus.PENDING,
        },
        include: {
          sender: {
            select: { id: true, email: true, name: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.friendRequest.findMany({
        where: {
          senderId: userId,
          status: FriendRequestStatus.PENDING,
        },
        include: {
          receiver: {
            select: { id: true, email: true, name: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { incoming, outgoing };
  }

  async respondToFriendRequest(
    userId: string,
    requestId: string,
    action: 'accept' | 'decline',
  ) {
    const request = await this.prisma.friendRequest.findFirst({
      where: {
        id: requestId,
        receiverId: userId,
        status: FriendRequestStatus.PENDING,
      },
    });

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    if (action === 'decline') {
      return this.prisma.$transaction(async (tx) => {
        const updatedRequest = await tx.friendRequest.update({
          where: { id: request.id },
          data: { status: FriendRequestStatus.DECLINED },
        });

        await this.outboxService.enqueue(
          {
            aggregate: 'FriendRequest',
            aggregateId: updatedRequest.id,
            type: OUTBOX_EVENT_TYPES.FRIEND_REQUEST_DECLINED,
            payload: {
              requestId: updatedRequest.id,
              senderId: updatedRequest.senderId,
              receiverId: updatedRequest.receiverId,
              status: updatedRequest.status,
            },
          },
          tx,
        );

        return updatedRequest;
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.friendRequest.update({
        where: { id: request.id },
        data: { status: FriendRequestStatus.ACCEPTED },
      });

      await tx.friend.createMany({
        data: [
          { userId: request.senderId, friendId: request.receiverId },
          { userId: request.receiverId, friendId: request.senderId },
        ],
        skipDuplicates: true,
      });

      await this.outboxService.enqueueMany(
        [
          {
            aggregate: 'FriendRequest',
            aggregateId: updatedRequest.id,
            type: OUTBOX_EVENT_TYPES.FRIEND_REQUEST_ACCEPTED,
            payload: {
              requestId: updatedRequest.id,
              senderId: updatedRequest.senderId,
              receiverId: updatedRequest.receiverId,
              status: updatedRequest.status,
            },
          },
          {
            aggregate: 'Friend',
            aggregateId: `${request.senderId}:${request.receiverId}`,
            type: OUTBOX_EVENT_TYPES.FRIEND_LIST_CHANGED,
            payload: {
              userId: request.senderId,
              friendId: request.receiverId,
              reason: 'accepted',
            },
          },
          {
            aggregate: 'Friend',
            aggregateId: `${request.receiverId}:${request.senderId}`,
            type: OUTBOX_EVENT_TYPES.FRIEND_LIST_CHANGED,
            payload: {
              userId: request.receiverId,
              friendId: request.senderId,
              reason: 'accepted',
            },
          },
        ],
        tx,
      );

      return updatedRequest;
    });
  }

  async getFriendsWithProgress(userId: string) {
    const friendships = await this.prisma.friend.findMany({
      where: { userId },
      include: {
        friend: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            categories: {
              include: {
                children: {
                  orderBy: { name: 'asc' },
                },
              },
              orderBy: { name: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return friendships.map(({ friend, createdAt }) => ({
      ...friend,
      friendedAt: createdAt,
      categories: friend.categories.map((category) => ({
        ...category,
        masteryTier:
          category.children.length > 0
            ? Math.min(...category.children.map((sub) => sub.count))
            : 0,
      })),
    }));
  }
}
