import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../utils/types/auth-user.type';
import {
  CreateUserDto,
  EditUserPayloadDto,
  FindUserPayloadDto,
} from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    {
      email,
      hashedPassword,
      name,
      imageUrl,
    }: Partial<CreateUserDto> & { hashedPassword?: string },
    type: 'auth' | 'oauth' = 'auth',
  ): Promise<PublicUser> {
    const userByEmail = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userByEmail) {
      if (type === 'auth')
        throw new ConflictException('User with this email already exists');
      return userByEmail;
    }

    return await this.prismaService.user.create({
      data: {
        email,
        hashedPassword: type === 'auth' ? hashedPassword : null,
        name,
        imageUrl,
      },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        hashedPassword: true,
      },
    });
  }

  async edit({
    userId,
    name,
    imageUrl,
  }: EditUserPayloadDto): Promise<PublicUser> {
    return await this.prismaService.user.update({
      where: { id: userId },
      data: { name, imageUrl },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        hashedPassword: true,
      },
    });
  }

  async findOne({ id, email, name }: FindUserPayloadDto) {
    if (!id && !email && !name)
      throw new BadRequestException('ID, email or name missing.');

    const user = await this.prismaService.user.findUnique({
      where: {
        id: id || undefined,
        email: email || undefined,
        name: name || undefined,
      },
    });

    return user;
  }
}
