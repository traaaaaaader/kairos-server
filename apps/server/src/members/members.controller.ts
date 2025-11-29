import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CurrentUser, JwtAccessGuard } from '@app/core-lib';
import {
  ServerIdQueryDto,
  MemberIdParamDto,
  UpdateMemberDto,
  DeleteMemberPayloadDto,
  UpdateMemberPayloadDto,
} from './dto/members.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@UseGuards(JwtAccessGuard)
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  async getOne(
    @Query() query: ServerIdQueryDto,
    @CurrentUser() userId: string,
  ) {
    await validateOrReject(query);
    return this.membersService.getOne(query.serverId, userId);
  }

  @Get('all')
  async getAll(@Query() query: ServerIdQueryDto) {
    await validateOrReject(query);
    return this.membersService.getAll(query.serverId);
  }

  @Delete(':memberId')
  async delete(
    @Query() query: ServerIdQueryDto,
    @Param() params: MemberIdParamDto,
    @CurrentUser() userId: string,
  ) {
    await validateOrReject(query);
    await validateOrReject(params);

    const payload = plainToInstance(DeleteMemberPayloadDto, {
      userId,
      serverId: query.serverId,
      memberId: params.memberId,
    });
    await validateOrReject(payload);

    return this.membersService.delete(payload);
  }

  @Patch(':memberId')
  async update(
    @Query() query: ServerIdQueryDto,
    @Param() params: MemberIdParamDto,
    @CurrentUser() userId: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    await validateOrReject(query);
    await validateOrReject(params);
    await validateOrReject(updateMemberDto);

    const payload = plainToInstance(UpdateMemberPayloadDto, {
      userId,
      serverId: query.serverId,
      memberId: params.memberId,
      updateMemberDto,
    });
    await validateOrReject(payload);

    const updated = await this.membersService.update(payload);
    if (!updated) throw new NotFoundException('Member not found');
    return updated;
  }
}
