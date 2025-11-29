/*
  Warnings:

  - You are about to drop the column `userId` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,serverId]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "MemberRole" ADD VALUE 'CREATOR';

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_userId_fkey";

-- DropForeignKey
ALTER TABLE "servers" DROP CONSTRAINT "servers_userId_fkey";

-- DropIndex
DROP INDEX "servers_userId_idx";

-- AlterTable
ALTER TABLE "servers" DROP COLUMN "userId";

-- DropTable
DROP TABLE "users";

-- CreateIndex
CREATE UNIQUE INDEX "members_userId_serverId_key" ON "members"("userId", "serverId");
