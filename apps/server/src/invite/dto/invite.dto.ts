import { IsDefined, IsUUID, IsString } from 'class-validator';

/* -----------------------------------------
 * Body DTO — для обновления inviteCode
 * ----------------------------------------- */
export class UpdateInviteBodyDto {
  @IsDefined({ message: 'serverId обязателен' })
  @IsUUID('4', { message: 'serverId должен быть корректным UUID' })
  serverId: string;
}

/* -----------------------------------------
 * Params DTO — для inviteCode
 * ----------------------------------------- */
export class InviteCodeParamDto {
  @IsDefined({ message: 'inviteCode обязателен' })
  @IsString({ message: 'inviteCode должен быть строкой' })
  inviteCode: string;
}

/* -----------------------------------------
 * Payload DTO для сервиса
 * ----------------------------------------- */
export class InvitePayloadDto {
  @IsDefined({ message: 'userId обязателен' })
  @IsUUID('4', { message: 'userId должен быть корректным UUID' })
  userId: string;

  @IsDefined({ message: 'serverId обязателен' })
  @IsUUID('4', { message: 'serverId должен быть корректным UUID' })
  serverId: string;
}

export class InviteByCodePayloadDto {
  @IsDefined({ message: 'userId обязателен' })
  @IsUUID('4', { message: 'userId должен быть корректным UUID' })
  userId: string;

  @IsDefined({ message: 'inviteCode обязателен' })
  @IsString({ message: 'inviteCode должен быть строкой' })
  inviteCode: string;
}
