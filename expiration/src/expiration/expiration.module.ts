import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ExpirationController } from './expiration.controller';
import { ExpirationConsumer } from './expiration.processor';
import { NatsPublisherConfig } from '@ar-ticketing/common';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'expiration',
    }),
    NatsStreamingTransport.registerAsync({
      useFactory: async () => new NatsPublisherConfig().toJSON(),
    }),
  ],
  controllers: [ExpirationController],
  providers: [ExpirationConsumer],
})
export class ExpirationModule {}
