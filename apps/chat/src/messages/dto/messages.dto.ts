import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class ConversationIdParamDto {
  @IsUUID('4', { message: 'conversationId must be a valid UUID' })
  @IsNotEmpty({ message: 'conversationId is required' })
  conversationId: string;
}

export class MessageIdParamDto {
  @IsUUID('4', { message: 'messageId must be a valid UUID' })
  @IsNotEmpty({ message: 'messageId is required' })
  messageId: string;
}

export class UserIdParamDto {
  @IsUUID('4', { message: 'userId must be a valid UUID' })
  @IsNotEmpty({ message: 'userId is required' })
  userId: string;
}

export class SendMessageDto {
  @IsString({ message: 'content must be a string' })
  @IsNotEmpty({ message: 'content is required' })
  content: string;

  @IsString({ message: 'fileUrl must be a string' })
  @IsOptional()
  fileUrl?: string;
}

export class EditMessageDto {
  @IsString({ message: 'content must be a string' })
  @IsNotEmpty({ message: 'content is required' })
  content: string;
}

export class GetMessagesQueryDto {
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50;

  @IsOptional()
  @IsUUID('4', { message: 'cursor must be a valid UUID' })
  cursor?: string;
}
