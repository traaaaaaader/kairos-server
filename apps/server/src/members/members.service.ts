import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DeleteMemberPayloadDto,
  UpdateMemberPayloadDto,
} from './dto/members.dto';

@Injectable()
export class MembersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getOne(serverId: string, userId: string) {
    return await this.prismaService.member.findUnique({
      where: { userId_serverId: { userId, serverId } },
    });
  }

  async getAll(serverId: string) {
    return await this.prismaService.member.findMany({
      where: { serverId },
    });
  }

  async delete(payload: DeleteMemberPayloadDto) {
    const { memberId, serverId, userId } = payload;

    if (!userId) throw new UnauthorizedException();
    if (!memberId || !serverId) throw new BadRequestException();

    return await this.prismaService.server.update({
      where: { id: serverId },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            userId: { not: userId },
          },
        },
      },
      include: { members: { orderBy: { role: 'asc' } } },
    });
  }

  async update(payload: UpdateMemberPayloadDto) {
    const { memberId, serverId, userId, updateMemberDto } = payload;

    if (!userId) throw new UnauthorizedException();
    if (!memberId || !serverId) throw new BadRequestException();

    return await this.prismaService.server.update({
      where: { id: serverId },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              userId: { not: userId },
            },
            data: { role: updateMemberDto.role },
          },
        },
      },
      include: { members: { orderBy: { role: 'asc' } } },
    });
  }
}
