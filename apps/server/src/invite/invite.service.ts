import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { InvitePayloadDto, InviteByCodePayloadDto } from './dto/invite.dto';

@Injectable()
export class InviteService {
  constructor(private readonly prismaService: PrismaService) {}

  async invite(payload: InviteByCodePayloadDto) {
    const { userId, inviteCode } = payload;

    if (!userId) throw new UnauthorizedException('User ID missing.');
    if (!inviteCode) throw new BadRequestException('Invite code missing.');

    return await this.prismaService.server.update({
      where: { inviteCode },
      data: {
        members: { create: { userId } },
      },
      include: { members: true, channels: true },
    });
  }

  async update(payload: InvitePayloadDto) {
    const { userId, serverId } = payload;

    if (!userId) throw new UnauthorizedException('User ID missing.');
    if (!serverId) throw new BadRequestException('Server ID missing.');

    return await this.prismaService.server.update({
      where: { id: serverId },
      data: { inviteCode: uuidv4() },
      include: { members: true, channels: true },
    });
  }
}
