import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { ChannelType } from '@prisma/db-server';

import { Type } from 'class-transformer';

/* -----------------------------------------
 * CreateChannelDto
 * ----------------------------------------- */
export class CreateChannelDto {
  @IsDefined({ message: 'Название канала обязательно' })
  @IsNotEmpty({ message: 'Название канала не может быть пустым' })
  @IsString({ message: 'Название канала должно быть строкой' })
  @MinLength(1, {
    message: 'Название канала должно содержать минимум 1 символ',
  })
  name: string;

  @IsDefined({ message: 'Тип канала обязателен' })
  @IsEnum(ChannelType, {
    message: `Недопустимый тип канала. Возможные значения: ${Object.values(ChannelType).join(', ')}`,
  })
  type: ChannelType;
}

/* -----------------------------------------
 * UpdateChannelDto
 * ----------------------------------------- */
export class UpdateChannelDto {
  @IsOptional()
  @IsString({ message: 'Название канала должно быть строкой' })
  @MinLength(1, {
    message: 'Название канала должно содержать минимум 1 символ',
  })
  name?: string;

  @IsOptional()
  @IsEnum(ChannelType, {
    message: `Недопустимый тип канала. Возможные значения: ${Object.values(ChannelType).join(', ')}`,
  })
  type?: ChannelType;
}

/* -----------------------------------------
 * Query DTO — serverId
 * ----------------------------------------- */
export class ServerIdQueryDto {
  @IsDefined({ message: 'serverId обязателен' })
  @IsUUID('4', { message: 'serverId должен быть корректным UUID' })
  serverId: string;
}

/* -----------------------------------------
 * Params DTO — channelId
 * ----------------------------------------- */
export class ChannelIdParamDto {
  @IsDefined({ message: 'channelId обязателен' })
  @IsUUID('4', { message: 'channelId должен быть корректным UUID' })
  channelId: string;
}

/* -----------------------------------------
 * Payload DTOs for Service
 * ----------------------------------------- */

export class CreateChannelPayloadDto {
  @IsDefined({ message: 'userId обязателен' })
  @IsUUID('4', { message: 'userId должен быть корректным UUID' })
  userId: string;

  @IsDefined({ message: 'serverId обязателен' })
  @IsUUID('4', { message: 'serverId должен быть корректным UUID' })
  serverId: string;

  @IsDefined({ message: 'createChannelDto обязателен' })
  @ValidateNested()
  @Type(() => CreateChannelDto)
  createChannelDto: CreateChannelDto;
}

export class UpdateChannelPayloadDto {
  @IsDefined({ message: 'userId обязателен' })
  @IsUUID('4', { message: 'userId должен быть корректным UUID' })
  userId: string;

  @IsDefined({ message: 'serverId обязателен' })
  @IsUUID('4', { message: 'serverId должен быть корректным UUID' })
  serverId: string;

  @IsDefined({ message: 'channelId обязателен' })
  @IsUUID('4', { message: 'channelId должен быть корректным UUID' })
  channelId: string;

  @IsDefined({ message: 'updateChannelDto обязателен' })
  @ValidateNested()
  @Type(() => UpdateChannelDto)
  updateChannelDto: UpdateChannelDto;
}

export class DeleteChannelPayloadDto {
  @IsDefined({ message: 'userId обязателен' })
  @IsUUID('4', { message: 'userId должен быть корректным UUID' })
  userId: string;

  @IsDefined({ message: 'serverId обязателен' })
  @IsUUID('4', { message: 'serverId должен быть корректным UUID' })
  serverId: string;

  @IsDefined({ message: 'channelId обязателен' })
  @IsUUID('4', { message: 'channelId должен быть корректным UUID' })
  channelId: string;
}
