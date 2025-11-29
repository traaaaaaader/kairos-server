import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CurrentUser, JwtAccessGuard } from '@app/core-lib';
import {
  CreateChannelDto,
  UpdateChannelDto,
  ServerIdQueryDto,
  ChannelIdParamDto,
  CreateChannelPayloadDto,
  UpdateChannelPayloadDto,
  DeleteChannelPayloadDto,
} from './dto/channels.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@UseGuards(JwtAccessGuard)
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get(':channelId')
  async getOne(
    @Param() params: ChannelIdParamDto,
    @Query() query: ServerIdQueryDto,
  ) {
    const channel = await this.channelsService.get(
      params.channelId,
      query.serverId,
    );
    if (!channel) throw new NotFoundException('Channel not found');
    return channel;
  }

  @Get()
  async getAll(@Query() query: ServerIdQueryDto) {
    return this.channelsService.getChannels(query.serverId);
  }

  @Post()
  async create(
    @Query() query: ServerIdQueryDto,
    @CurrentUser() userId: string,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    const payload = plainToInstance(CreateChannelPayloadDto, {
      userId,
      serverId: query.serverId,
      createChannelDto,
    });
    await validateOrReject(payload);
    return this.channelsService.create(payload);
  }

  @Patch(':channelId')
  async update(
    @Param() params: ChannelIdParamDto,
    @Query() query: ServerIdQueryDto,
    @CurrentUser() userId: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    const payload = plainToInstance(UpdateChannelPayloadDto, {
      userId,
      serverId: query.serverId,
      channelId: params.channelId,
      updateChannelDto,
    });
    await validateOrReject(payload);
    const updated = await this.channelsService.update(payload);
    if (!updated) throw new NotFoundException('Channel not found');
    return updated;
  }

  @Delete(':channelId')
  async delete(
    @Param() params: ChannelIdParamDto,
    @Query() query: ServerIdQueryDto,
    @CurrentUser() userId: string,
  ) {
    const payload = plainToInstance(DeleteChannelPayloadDto, {
      userId,
      serverId: query.serverId,
      channelId: params.channelId,
    });
    await validateOrReject(payload);
    return this.channelsService.delete(payload);
  }
}
