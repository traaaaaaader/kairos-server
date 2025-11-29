import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { MemberRole } from '@prisma/db-server';
import { CreateServerDto, UpdateServerDto } from './dto/servers.dto';

@Injectable()
export class ServersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, { name, imageUrl }: CreateServerDto) {
    if (!userId) throw new UnauthorizedException();
    if (!name) throw new BadRequestException('Missing name');

    return this.prismaService.server.create({
      data: {
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: { create: [{ name: 'general' }] },
        members: { create: [{ userId, role: MemberRole.ADMIN }] },
      },
    });
  }

  async update(
    serverId: string,
    userId: string,
    { name, imageUrl }: UpdateServerDto,
  ) {
    if (!userId) throw new UnauthorizedException();
    await this.checkMemberRole(serverId, userId, [
      MemberRole.ADMIN,
      MemberRole.MODERATOR,
    ]);

    return this.prismaService.server.update({
      where: { id: serverId },
      data: { name, imageUrl },
    });
  }

  async delete(serverId: string, userId: string) {
    if (!userId) throw new UnauthorizedException();
    await this.checkMemberRole(serverId, userId, [MemberRole.ADMIN]);
    return this.prismaService.server.delete({ where: { id: serverId } });
  }

  async leave(serverId: string, userId: string) {
    if (!userId) throw new UnauthorizedException();
    if (!serverId) throw new BadRequestException();

    return this.prismaService.server.update({
      where: { id: serverId },
      data: { members: { deleteMany: { userId } } },
    });
  }

  async getServer(serverId: string, userId: string) {
    return this.prismaService.server.findFirst({
      where: { id: serverId, members: { some: { userId } } },
      include: { members: true, channels: true },
    });
  }

  async getServers(userId: string) {
    return this.prismaService.server.findMany({
      where: { members: { some: { userId } } },
      include: { members: true, channels: true },
    });
  }

  private async checkMemberRole(
    serverId: string,
    userId: string,
    allowedRoles: MemberRole[] = [MemberRole.ADMIN, MemberRole.MODERATOR],
  ) {
    const member = await this.prismaService.member.findUnique({
      where: { userId_serverId: { userId, serverId } },
    });

    if (!member)
      throw new UnauthorizedException('You are not a member of this server.');
    if (!allowedRoles.includes(member.role))
      throw new UnauthorizedException(
        'You do not have permission to perform this action.',
      );
    return member;
  }
}
