import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { AuthModule } from '@app/core-lib';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [InviteController],
  providers: [InviteService],
})
export class InviteModule {}
