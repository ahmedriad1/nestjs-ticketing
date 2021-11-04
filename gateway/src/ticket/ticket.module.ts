import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TICKETS_MICROSERVICE_PROVIDER } from '../shared/constants';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: TICKETS_MICROSERVICE_PROVIDER,
        transport: Transport.TCP,
        options: {
          host: 'tickets-srv',
          port: 3000,
        },
      },
    ]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
