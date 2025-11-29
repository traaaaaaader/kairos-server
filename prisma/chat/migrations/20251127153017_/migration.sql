/*
  Warnings:

  - You are about to drop the column `memberId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `conversations_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chatType` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('channel', 'direct');

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_userOneId_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_userTwoId_fkey";

-- DropForeignKey
ALTER TABLE "conversations_messages" DROP CONSTRAINT "conversations_messages_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "conversations_messages" DROP CONSTRAINT "conversations_messages_senderId_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_memberId_fkey";

-- DropIndex
DROP INDEX "conversations_userTwoId_userOneId_key";

-- DropIndex
DROP INDEX "messages_memberId_idx";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "memberId",
ADD COLUMN     "chatType" "ChatType" NOT NULL,
ADD COLUMN     "conversationId" TEXT,
ADD COLUMN     "senderId" TEXT NOT NULL,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "channelId" DROP NOT NULL;

-- DropTable
DROP TABLE "conversations_messages";

-- DropTable
DROP TABLE "members";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "MemberRole";

-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
