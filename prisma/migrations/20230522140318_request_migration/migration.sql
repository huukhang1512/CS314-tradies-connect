/*
  Warnings:

  - The values [NEW] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[requestId,providerId]` on the table `Proposal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('BROADCASTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
ALTER TABLE "Request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Request" ALTER COLUMN "status" TYPE "RequestStatus_new" USING ("status"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "RequestStatus_old";
ALTER TABLE "Request" ALTER COLUMN "status" SET DEFAULT 'BROADCASTED';
COMMIT;

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "finishedDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "status" SET DEFAULT 'BROADCASTED';

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_requestId_providerId_key" ON "Proposal"("requestId", "providerId");
