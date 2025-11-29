import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';

import { UsersService } from '../users/users.service';
import { AuthUser } from '../utils/types/auth-user.type';
import { RegisterDto, LoginUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthUser> {
    const { email, name, password, imageUrl } = registerDto;

    const hashedPassword = await hash(password);

    const createdUser = await this.usersService.create({
      email,
      name,
      hashedPassword,
      imageUrl,
    });

    return this.generateTokens(createdUser.id);
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthUser> {
    const { email, password } = loginUserDto;

    const user = await this.validateUser(email, password);
    return this.generateTokens(user.id);
  }

  async googleAuth(user: any): Promise<AuthUser> {
    if (!user) {
      throw new BadRequestException('No user received from Google');
    }

    const { email, name, imageUrl } = user;

    const userByEmail = await this.usersService.findOne({ email });

    if (userByEmail) {
      return this.generateTokens(userByEmail.id);
    }

    const createdUser = await this.usersService.create(
      { email, name, imageUrl },
      'oauth',
    );

    return this.generateTokens(createdUser.id);
  }

  async generateTokens(userId: string): Promise<AuthUser> {
    const user = await this.usersService.findOne({ id: userId });

    const accessToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES'),
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      },
    };
  }

  public async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne({ email });

    if (!user) return null;
    if (!user.hashedPassword) {
      throw new BadRequestException(
        'Probably you already have an account via Google',
      );
    }

    const isValidPassword = await verify(user.hashedPassword, password);
    if (!isValidPassword) return null;

    return user;
  }
}
