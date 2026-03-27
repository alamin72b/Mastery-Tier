import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OutboxEvent, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxPublisher } from './outbox.publisher';

@Injectable()
export class OutboxProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxProcessor.name);
  private readonly batchSize = 50;
  private readonly pollIntervalMs = 2000;
  private readonly lockTimeoutMs = 60_000;
  private readonly workerId = `outbox-${randomUUID()}`;

  private isRunning = false;
  private timer: NodeJS.Timeout | null = null;
  private stopped = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly outboxPublisher: OutboxPublisher,
  ) {}

  onModuleInit() {
    this.start();
  }

  onModuleDestroy() {
    this.stop();
  }

  private start() {
    if (this.timer) {
      return;
    }

    this.scheduleNextRun(1000);
    this.logger.log(`Outbox processor started with workerId=${this.workerId}`);
  }

  private stop() {
    this.stopped = true;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.logger.log(`Outbox processor stopped for workerId=${this.workerId}`);
  }

  private scheduleNextRun(delayMs: number) {
    if (this.stopped) {
      return;
    }

    this.timer = setTimeout(() => {
      void this.runCycle();
    }, delayMs);
  }

  private async runCycle() {
    try {
      await this.processBatch();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown outbox processor error';

      this.logger.error(`Outbox processor failed: ${message}`);
    } finally {
      this.scheduleNextRun(this.pollIntervalMs);
    }
  }

  async processBatch() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      const claimedEvents = await this.claimBatch();

      if (claimedEvents.length === 0) {
        return;
      }

      this.logger.log(
        `Worker ${this.workerId} claimed ${claimedEvents.length} outbox event(s)`,
      );

      for (const event of claimedEvents) {
        await this.processClaimedEvent(event);
      }
    } finally {
      this.isRunning = false;
    }
  }

  private async claimBatch(): Promise<OutboxEvent[]> {
    const now = new Date();
    const staleBefore = new Date(now.getTime() - this.lockTimeoutMs);

    const claimedRows = await this.prisma.$queryRaw<OutboxEvent[]>(
      Prisma.sql`
        WITH candidate_rows AS (
          SELECT id
          FROM "OutboxEvent"
          WHERE "processedAt" IS NULL
            AND (
              "lockedAt" IS NULL
              OR "lockedAt" < ${staleBefore}
            )
          ORDER BY "createdAt" ASC
          LIMIT ${this.batchSize}
          FOR UPDATE SKIP LOCKED
        )
        UPDATE "OutboxEvent" oe
        SET
          "lockedAt" = ${now},
          "lockedBy" = ${this.workerId}
        FROM candidate_rows
        WHERE oe.id = candidate_rows.id
        RETURNING
          oe.id,
          oe.aggregate,
          oe."aggregateId",
          oe.type,
          oe.payload,
          oe."processedAt",
          oe."createdAt",
          oe.attempts,
          oe."lockedAt",
          oe."lockedBy"
      `,
    );

    return claimedRows;
  }

  private async processClaimedEvent(event: OutboxEvent) {
    try {
      await this.outboxPublisher.publish(event);

      await this.prisma.outboxEvent.updateMany({
        where: {
          id: event.id,
          lockedBy: this.workerId,
          processedAt: null,
        },
        data: {
          processedAt: new Date(),
          lockedAt: null,
          lockedBy: null,
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown publish error';

      this.logger.error(
        `Failed to process outbox event ${event.id} by worker ${this.workerId}: ${message}`,
      );

      await this.prisma.outboxEvent.updateMany({
        where: {
          id: event.id,
          lockedBy: this.workerId,
          processedAt: null,
        },
        data: {
          attempts: {
            increment: 1,
          },
          lockedAt: null,
          lockedBy: null,
        },
      });
    }
  }
}
