import {
  MicroserviceExceptionsFilter,
  MicroserviceValidationPipe,
} from '@ar-ticketing/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

const bootstrap = async () => {
  const logger = new Logger('AuthService');
  const port = 3000;

  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port,
    },
  });

  app.useGlobalFilters(new MicroserviceExceptionsFilter());
  app.useGlobalPipes(new MicroserviceValidationPipe());

  await app.listen();
  logger.log(`listening on port ${port}`);
};

bootstrap();
