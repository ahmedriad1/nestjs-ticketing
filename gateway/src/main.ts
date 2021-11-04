import { MicroserviceValidationPipe } from '@ar-ticketing/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './shared/exceptions/all-exception-filter';

async function bootstrap() {
  const logger = new Logger('Gateway');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new MicroserviceValidationPipe());

  app.useGlobalFilters(new AllExceptionFilter());
  app.set('trust proxy', true);

  await app.listen(3000);
  logger.log(`Gateway is listening on: ${await app.getUrl()}`);
}
bootstrap();
