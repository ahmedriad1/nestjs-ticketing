import { NatsListenerConfig } from '@ar-ticketing/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { TicketModule } from './ticket.module';

const bootstrap = async () => {
  const logger = new Logger('TicketsService');
  const port = 3000;

  const app = await NestFactory.create(TicketModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port,
    },
  });

  const config = new NatsListenerConfig({ queueGroupName: 'tickets-service' });
  app.connectMicroservice(config.toJSON());

  // moved exceptions filter & validation pipe to controller
  await app.startAllMicroservices();

  logger.log(`listening on port ${port}`);
};

bootstrap();
