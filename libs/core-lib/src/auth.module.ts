import { Module } from '@nestjs/common';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtSocketStrategy } from './strategies/jwt-socket.strategy';

@Module({
  providers: [JwtAccessStrategy, JwtSocketStrategy],
  exports: [JwtAccessStrategy, JwtSocketStrategy],
})
export class AuthModule {}
