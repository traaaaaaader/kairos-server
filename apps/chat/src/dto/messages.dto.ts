import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendDirectMessageWsDto {
  @IsUUID('4', { message: 'recipientId must be a valid UUID' })
  @IsNotEmpty({ message: 'recipientId is required' })
  recipientId: string;

  @IsString({ message: 'content must be a string' })
  @IsNotEmpty({ message: 'content is required' })
  content: string;

  @IsString({ message: 'fileUrl must be a string' })
  @IsOptional()
  fileUrl?: string;
}

export class SendChannelMessageWsDto {
  @IsUUID('4', { message: 'channelId must be a valid UUID' })
  @IsNotEmpty({ message: 'channelId is required' })
  channelId: string;

  @IsString({ message: 'content must be a string' })
  @IsNotEmpty({ message: 'content is required' })
  content: string;

  @IsString({ message: 'fileUrl must be a string' })
  @IsOptional()
  fileUrl?: string;
}

export class JoinChannelWsDto {
  @IsUUID('4', { message: 'channelId must be a valid UUID' })
  @IsNotEmpty({ message: 'channelId is required' })
  channelId: string;
}
