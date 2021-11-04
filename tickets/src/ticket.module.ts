import { NatsPublisherConfig } from '@ar-ticketing/common';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, ticketModelFactory } from './models/ticket.model';
import { OrderEventListenerController } from './order-event-listener.controller';
import { OrderEventListenerService } from './order-event-listener.service';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeatureAsync([
      {
        name: Ticket.name,
        useFactory: ticketModelFactory,
      },
    ]),
    NatsStreamingTransport.registerAsync({
      useFactory: async () => new NatsPublisherConfig().toJSON(),
    }),
  ],
  controllers: [TicketController, OrderEventListenerController],
  providers: [TicketService, OrderEventListenerService],
})
export class TicketModule {}
