-- CreateEnum
CREATE TYPE "IndexingStatus" AS ENUM ('NOT_STARTED', 'INDEXING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "repository" ADD COLUMN     "indexingStatus" "IndexingStatus" NOT NULL DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "billingCycleStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "chatMessagesUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "issuesUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "prsCreated" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "prsUsed" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "issue" (
    "id" TEXT NOT NULL,
    "githubId" BIGINT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rule" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "issue_repositoryId_idx" ON "issue"("repositoryId");

-- CreateIndex
CREATE INDEX "rule_userId_idx" ON "rule"("userId");

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule" ADD CONSTRAINT "rule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
