import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CurrentUser, JwtAccessGuard } from '@app/core-lib';
import { ServersService } from './servers.service';
import {
  CreateServerDto,
  UpdateServerDto,
  ServerIdParamDto,
  CreateServerPayloadDto,
  UpdateServerPayloadDto,
  DeleteServerPayloadDto,
} from './dto/servers.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@UseGuards(JwtAccessGuard)
@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Get(':serverId')
  async getOne(
    @Param() params: ServerIdParamDto,
    @CurrentUser() userId: string,
  ) {
    await validateOrReject(params);
    const server = await this.serversService.getServer(params.serverId, userId);
    if (!server) throw new NotFoundException('Server not found');
    return server;
  }

  @Get()
  async getAll(@CurrentUser() userId: string) {
    return this.serversService.getServers(userId);
  }

  @Post()
  async create(
    @CurrentUser() userId: string,
    @Body() createServerDto: CreateServerDto,
  ) {
    await validateOrReject(createServerDto);
    const payload = plainToInstance(CreateServerPayloadDto, {
      userId,
      createServerDto,
    });
    await validateOrReject(payload);
    return this.serversService.create(payload.userId, payload.createServerDto);
  }

  @Patch(':serverId')
  async update(
    @Param() params: ServerIdParamDto,
    @CurrentUser() userId: string,
    @Body() updateServerDto: UpdateServerDto,
  ) {
    await validateOrReject(params);
    await validateOrReject(updateServerDto);

    const payload = plainToInstance(UpdateServerPayloadDto, {
      userId,
      serverId: params.serverId,
      updateServerDto,
    });
    await validateOrReject(payload);

    const updated = await this.serversService.update(
      payload.serverId,
      payload.userId,
      payload.updateServerDto,
    );
    if (!updated) throw new NotFoundException('Server not found');
    return updated;
  }

  @Delete(':serverId')
  async delete(
    @Param() params: ServerIdParamDto,
    @CurrentUser() userId: string,
  ) {
    await validateOrReject(params);
    const payload = plainToInstance(DeleteServerPayloadDto, {
      userId,
      serverId: params.serverId,
    });
    await validateOrReject(payload);
    return this.serversService.delete(payload.serverId, payload.userId);
  }

  @Patch(':serverId/leave')
  async leave(
    @Param() params: ServerIdParamDto,
    @CurrentUser() userId: string,
  ) {
    await validateOrReject(params);
    return this.serversService.leave(params.serverId, userId);
  }
}
