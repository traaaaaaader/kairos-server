import {
  Controller,
  Patch,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CurrentUser, JwtAccessGuard } from '@app/core-lib';
import { InviteService } from './invite.service';
import {
  UpdateInviteBodyDto,
  InviteCodeParamDto,
  InvitePayloadDto,
  InviteByCodePayloadDto,
} from './dto/invite.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@UseGuards(JwtAccessGuard)
@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Patch('/invite-code')
  async invite(
    @CurrentUser() userId: string,
    @Body() body: UpdateInviteBodyDto,
  ) {
    const payload = plainToInstance(InvitePayloadDto, {
      userId,
      serverId: body.serverId,
    });
    await validateOrReject(payload);

    const updated = await this.inviteService.update(payload);
    if (!updated) throw new NotFoundException('Server not found');
    return updated;
  }

  @Patch(':inviteCode')
  async update(
    @CurrentUser() userId: string,
    @Param() params: InviteCodeParamDto,
  ) {
    const payload = plainToInstance(InviteByCodePayloadDto, {
      userId,
      inviteCode: params.inviteCode,
    });
    await validateOrReject(payload);

    const invited = await this.inviteService.invite(payload);
    if (!invited) throw new NotFoundException('Invite code invalid');
    return invited;
  }
}
