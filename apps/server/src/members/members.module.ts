import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { AuthModule } from '@app/core-lib';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
