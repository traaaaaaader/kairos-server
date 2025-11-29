import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { AuthModule } from '@app/core-lib';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ServersController],
  providers: [ServersService],
})
export class ServersModule {}
