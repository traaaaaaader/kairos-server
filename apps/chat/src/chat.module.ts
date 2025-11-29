import { forwardRef, Module } from '@nestjs/common';

import { MessagesModule } from './messages/messages.module';

import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat.gateway';
import { MediasoupModule } from './mediasoup/mediasoup.module';
import { AuthModule } from '@app/core-lib';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    forwardRef(() => MessagesModule),
    forwardRef(() => AuthModule),
    MediasoupModule,
  ],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
