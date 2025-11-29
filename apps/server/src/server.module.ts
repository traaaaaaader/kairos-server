import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ChannelsModule } from './channels/channels.module';
import { MembersModule } from './members/members.module';
import { ServersModule } from './servers/servers.module';
import { InviteModule } from './invite/invite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ChannelsModule,
    InviteModule,
    MembersModule,
    ServersModule,
  ],
})
export class ServerModule {}
