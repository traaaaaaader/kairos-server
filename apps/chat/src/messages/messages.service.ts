import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ChatType } from '@prisma/db-chat';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateDirectChat(user1Id: string, user2Id: string) {
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        type: ChatType.direct,
        AND: [
          { participants: { some: { userId: user1Id } } },
          { participants: { some: { userId: user2Id } } },
        ],
      },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          type: ChatType.direct,
          participants: {
            create: [{ userId: user1Id }, { userId: user2Id }],
          },
        },
        include: {
          participants: true,
          messages: true,
        },
      });
    }

    return conversation;
  }

  async getUserDirectChats(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        type: ChatType.direct,
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          where: { userId: { not: userId } },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return conversations;
  }

  async getOrCreateChannelConversation(channelId: string) {
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        type: ChatType.channel,
        channelId,
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          type: ChatType.channel,
          channelId,
        },
      });
    }

    return conversation;
  }

  async sendDirectMessage(
    senderId: string,
    recipientId: string,
    content: string,
    fileUrl?: string,
  ) {
    const conversation = await this.getOrCreateDirectChat(
      senderId,
      recipientId,
    );

    const message = await this.prisma.message.create({
      data: {
        content,
        fileUrl,
        senderId,
        conversationId: conversation.id,
      },
      include: {
        conversation: {
          include: {
            participants: true,
          },
        },
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async sendChannelMessage(
    channelId: string,
    senderId: string,
    content: string,
    fileUrl?: string,
  ) {
    // TODO: Проверить права через API микросервиса серверов
    // const hasAccess = await this.checkChannelAccess(channelId, senderId);

    const conversation = await this.getOrCreateChannelConversation(channelId);

    const message = await this.prisma.message.create({
      data: {
        content,
        fileUrl,
        senderId,
        conversationId: conversation.id,
      },
    });

    return message;
  }

  async getMessages(
    conversationId: string,
    userId: string,
    limit = 50,
    cursor?: string,
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.type === ChatType.direct) {
      const isParticipant = conversation.participants.some(
        (p) => p.userId === userId,
      );
      if (!isParticipant) {
        throw new ForbiddenException('Access denied');
      }
    }

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        deleted: false,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });

    return messages;
  }

  async editMessage(messageId: string, userId: string, content: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { content, updatedAt: new Date() },
    });
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        deleted: true,
        deletedAt: new Date(),
        content: '[Deleted]',
      },
    });
  }
}
