import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ExpirationModule } from './expiration/expiration.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),
    ExpirationModule,
  ],
})
export class AppModule {}
