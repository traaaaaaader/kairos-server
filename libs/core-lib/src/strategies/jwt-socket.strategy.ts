import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { JwtPayload } from '@app/core-lib';
import { Socket } from 'socket.io';

@Injectable()
export class JwtSocketStrategy extends PassportStrategy(
  Strategy,
  'jwt-socket',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: JwtSocketStrategy.extractJWT,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  private static extractJWT(socket: Socket): string | null {
    if (socket.data.token) {
      return socket.data.token;
    }
    return null;
  }

  async validate({ userId }: JwtPayload) {
    return userId;
  }
}
