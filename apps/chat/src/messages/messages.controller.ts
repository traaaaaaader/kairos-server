import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CurrentUser, JwtAccessGuard } from '@app/core-lib';
import { ChatType } from '@prisma/db-chat';
import { MessagesService } from './messages.service';
import {
  ConversationIdParamDto,
  EditMessageDto,
  GetMessagesQueryDto,
  MessageIdParamDto,
  SendMessageDto,
  UserIdParamDto,
} from './dto/messages.dto';
import { validateOrReject } from 'class-validator';

@UseGuards(JwtAccessGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('direct')
  async getDirectChats(@CurrentUser() userId: string) {
    return this.messagesService.getUserDirectChats(userId);
  }

  @Post('direct/:userId')
  async getOrCreateDirectChat(
    @CurrentUser() userId: string,
    @Param() params: UserIdParamDto,
  ) {
    await validateOrReject(params);
    return this.messagesService.getOrCreateDirectChat(
      userId,
      params.userId,
    );
  }

  @Get('conversations/:conversationId/messages')
  async getMessages(
    @CurrentUser() userId: string,
    @Param() params: ConversationIdParamDto,
    @Query() query: GetMessagesQueryDto,
  ) {
    await validateOrReject(params);
    await validateOrReject(query);

    return this.messagesService.getMessages(
      params.conversationId,
      userId,
      query.limit,
      query.cursor,
    );
  }

  @Post('conversations/:conversationId/messages')
  async sendMessage(
    @CurrentUser() userId: string,
    @Param() params: ConversationIdParamDto,
    @Body() body: SendMessageDto,
  ) {
    await validateOrReject(params);
    await validateOrReject(body);

    const conversation = await this.messagesService[
      'prisma'
    ].conversation.findUnique({
      where: { id: params.conversationId },
      include: { participants: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.type === ChatType.direct) {
      const recipient = conversation.participants.find(
        (p) => p.userId !== userId,
      );
      if (!recipient) {
        throw new NotFoundException('Recipient not found');
      }
      return this.messagesService.sendDirectMessage(
        userId,
        recipient.userId,
        body.content,
        body.fileUrl,
      );
    } else {
      return this.messagesService.sendChannelMessage(
        conversation.channelId!,
        userId,
        body.content,
        body.fileUrl,
      );
    }
  }

  @Put('messages/:messageId')
  async editMessage(
    @CurrentUser() userId: string,
    @Param() params: MessageIdParamDto,
    @Body() body: EditMessageDto,
  ) {
    await validateOrReject(params);
    await validateOrReject(body);

    return this.messagesService.editMessage(
      params.messageId,
      userId,
      body.content,
    );
  }

  @Delete('messages/:messageId')
  async deleteMessage(
    @CurrentUser() userId: string,
    @Param() params: MessageIdParamDto,
  ) {
    await validateOrReject(params);
    return this.messagesService.deleteMessage(params.messageId, userId);
  }
}
