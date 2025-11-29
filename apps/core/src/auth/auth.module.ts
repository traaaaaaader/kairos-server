import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';

import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from '../strategies/local.strategy';
import { GoogleStrategy } from '../strategies/google.strategy';
import { JwtRefreshStrategy } from '../strategies/jwt-refresh.stretegy';
import { GoogleGuard } from '../guard/google.guard';
import {
  JwtAccessGuard,
  JwtAccessStrategy,
  JwtSocketGuard,
  JwtSocketStrategy,
} from '@app/core-lib';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtRefreshStrategy,
    JwtAccessStrategy,
    JwtSocketStrategy,
    GoogleStrategy,
    JwtAccessGuard,
    JwtSocketGuard,
    GoogleGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
