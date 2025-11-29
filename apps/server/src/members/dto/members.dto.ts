import { IsDefined, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { MemberRole } from '@prisma/db-server';
import { Type } from 'class-transformer';

/* -----------------------------------------
 * Query DTO — serverId
 * ----------------------------------------- */
export class ServerIdQueryDto {
  @IsDefined({ message: 'serverId обязателен' })
  @IsUUID('4', { message: 'serverId должен быть корректным UUID' })
  serverId: string;
}

/* -----------------------------------------
 * Params DTO — memberId
 * ----------------------------------------- */
export class MemberIdParamDto {
  @IsDefined({ message: 'memberId обязателен' })
  @IsUUID('4', { message: 'memberId должен быть корректным UUID' })
  memberId: string;
}

/* -----------------------------------------
 * DTO для обновления роли участника
 * ----------------------------------------- */
export class UpdateMemberDto {
  @IsDefined({ message: 'role обязателен' })
  @IsEnum(MemberRole, {
    message: `Недопустимая роль. Возможные значения: ${Object.values(MemberRole).join(', ')}`,
  })
  role: MemberRole;
}

/* -----------------------------------------
 * Payload DTO для сервиса
 * ----------------------------------------- */
export class DeleteMemberPayloadDto {
  @IsDefined({ message: 'userId обязателен' })
  @IsUUID('4', { message: 'userId должен быть корректным UUID' })
  userId: string;

  @IsDefined({ message: 'serverId обязателен' })
  @IsUUID('4', { message: 'serverId должен быть корректным UUID' })
  serverId: string;

  @IsDefined({ message: 'memberId обязателен' })
  @IsUUID('4', { message: 'memberId должен быть корректным UUID' })
  memberId: string;
}

export class UpdateMemberPayloadDto {
  @IsDefined({ message: 'userId обязателен' })
  @IsUUID('4', { message: 'userId должен быть корректным UUID' })
  userId: string;

  @IsDefined({ message: 'serverId обязателен' })
  @IsUUID('4', { message: 'serverId должен быть корректным UUID' })
  serverId: string;

  @IsDefined({ message: 'memberId обязателен' })
  @IsUUID('4', { message: 'memberId должен быть корректным UUID' })
  memberId: string;

  @IsDefined({ message: 'updateMemberDto обязателен' })
  @Type(() => UpdateMemberDto)
  updateMemberDto: UpdateMemberDto;
}
