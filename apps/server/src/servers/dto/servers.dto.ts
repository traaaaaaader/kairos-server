import {
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

/* -----------------------------------------
 * Params DTO — serverId
 * ----------------------------------------- */
export class ServerIdParamDto {
  @IsDefined({ message: 'serverId обязателен' })
  @IsUUID('4', { message: 'serverId должен быть корректным UUID' })
  serverId: string;
}

/* -----------------------------------------
 * DTO для создания сервера
 * ----------------------------------------- */
export class CreateServerDto {
  @IsDefined({ message: 'Название сервера обязательно' })
  @IsString({ message: 'Название сервера должно быть строкой' })
  @MinLength(1, {
    message: 'Название сервера должно содержать минимум 1 символ',
  })
  name: string;

  @IsOptional()
  @IsString({ message: 'imageUrl должен быть строкой' })
  imageUrl?: string;
}

/* -----------------------------------------
 * DTO для обновления сервера
 * ----------------------------------------- */
export class UpdateServerDto {
  @IsOptional()
  @IsString({ message: 'Название сервера должно быть строкой' })
  @MinLength(1, {
    message: 'Название сервера должно содержать минимум 1 символ',
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'imageUrl должен быть строкой' })
  imageUrl?: string;
}

/* -----------------------------------------
 * Payload DTO для сервиса
 * ----------------------------------------- */
export class CreateServerPayloadDto {
  @IsDefined({ message: 'userId обязателен' })
  @IsUUID('4', { message: 'userId должен быть корректным UUID' })
  userId: string;

  @IsDefined({ message: 'createServerDto обязателен' })
  @Type(() => CreateServerDto)
  createServerDto: CreateServerDto;
}

export class UpdateServerPayloadDto {
  @IsDefined({ message: 'userId обязателен' })
  @IsUUID('4', { message: 'userId должен быть корректным UUID' })
  userId: string;

  @IsDefined({ message: 'serverId обязателен' })
  @IsUUID('4', { message: 'serverId должен быть корректным UUID' })
  serverId: string;

  @IsDefined({ message: 'updateServerDto обязателен' })
  @Type(() => UpdateServerDto)
  updateServerDto: UpdateServerDto;
}

export class DeleteServerPayloadDto {
  @IsDefined({ message: 'userId обязателен' })
  @IsUUID('4', { message: 'userId должен быть корректным UUID' })
  userId: string;

  @IsDefined({ message: 'serverId обязателен' })
  @IsUUID('4', { message: 'serverId должен быть корректным UUID' })
  serverId: string;
}
