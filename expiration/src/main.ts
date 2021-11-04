import { NatsListenerConfig } from '@ar-ticketing/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const bootstrap = async () => {
  const logger = new Logger('ExpirationService');

  const config = new NatsListenerConfig({
    queueGroupName: 'expiration-service',
  });
  const app = await NestFactory.createMicroservice(AppModule, config.toJSON());

  await app.listen();
  logger.log(`service started`);
};

bootstrap();
