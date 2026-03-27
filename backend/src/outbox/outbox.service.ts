import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxEventInput } from './outbox-event.types';

type DbClient = PrismaService | Prisma.TransactionClient;

@Injectable()
export class OutboxService {
  constructor(private readonly prisma: PrismaService) {}

  async enqueue(event: OutboxEventInput, db?: DbClient) {
    const client = db ?? this.prisma;

    return client.outboxEvent.create({
      data: {
        aggregate: event.aggregate,
        aggregateId: event.aggregateId,
        type: event.type,
        payload: event.payload as Prisma.InputJsonValue,
      },
    });
  }

  async enqueueMany(events: OutboxEventInput[], db?: DbClient) {
    if (events.length === 0) {
      return;
    }

    const client = db ?? this.prisma;

    await client.outboxEvent.createMany({
      data: events.map((event) => ({
        aggregate: event.aggregate,
        aggregateId: event.aggregateId,
        type: event.type,
        payload: event.payload as Prisma.InputJsonValue,
      })),
    });
  }
}
