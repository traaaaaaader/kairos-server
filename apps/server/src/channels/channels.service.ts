import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MemberRole } from '@prisma/db-server';
import {
  CreateChannelPayloadDto,
  UpdateChannelPayloadDto,
  DeleteChannelPayloadDto,
} from './dto/channels.dto';

@Injectable()
export class ChannelsService {
  constructor(private readonly prismaService: PrismaService) {}

  async get(channelId: string, serverId?: string) {
    return await this.prismaService.channel.findUnique({
      where: {
        id: channelId,
        ...(serverId && { serverId }),
      },
    });
  }

  async create(payload: CreateChannelPayloadDto) {
    const { userId, serverId, createChannelDto } = payload;
    if (!userId) throw new UnauthorizedException();
    if (!serverId) throw new BadRequestException();

    const { name, type } = createChannelDto;

    return await this.prismaService.server.update({
      where: {
        id: serverId,
        members: {
          some: { role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] } },
        },
      },
      data: {
        channels: {
          create: { name, type },
        },
      },
    });
  }

  async update(payload: UpdateChannelPayloadDto) {
    const { userId, serverId, channelId, updateChannelDto } = payload;
    if (!userId) throw new UnauthorizedException();
    if (!serverId || !channelId) throw new BadRequestException();

    const { name, type } = updateChannelDto;

    return await this.prismaService.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: { id: channelId },
            data: { name, type },
          },
        },
      },
    });
  }

  async delete(payload: DeleteChannelPayloadDto) {
    const { userId, serverId, channelId } = payload;
    if (!userId) throw new UnauthorizedException();
    if (!serverId || !channelId) throw new BadRequestException();

    return await this.prismaService.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          delete: { id: channelId },
        },
      },
    });
  }

  async getChannels(serverId: string) {
    return await this.prismaService.channel.findMany({
      where: { serverId },
    });
  }
}
