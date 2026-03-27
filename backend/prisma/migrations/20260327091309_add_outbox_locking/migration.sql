-- AlterTable
ALTER TABLE "OutboxEvent" ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "lockedBy" TEXT;

-- CreateIndex
CREATE INDEX "OutboxEvent_lockedAt_idx" ON "OutboxEvent"("lockedAt");

-- CreateIndex
CREATE INDEX "OutboxEvent_processedAt_lockedAt_createdAt_idx" ON "OutboxEvent"("processedAt", "lockedAt", "createdAt");
