import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Order, orderModelFactory } from './models/order.model';
import { Ticket, ticketModelFactory } from './models/ticket.model';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { NatsPublisherConfig } from '@ar-ticketing/common';
import { OrderListener } from './order.listener';
import { OrderListenerService } from './order-listener.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: orderModelFactory,
      },
      {
        name: Ticket.name,
        useFactory: ticketModelFactory,
        inject: [getModelToken(Order.name)],
      },
    ]),
    NatsStreamingTransport.registerAsync({
      useFactory: async () => new NatsPublisherConfig().toJSON(),
    }),
  ],
  controllers: [OrderController, OrderListener],
  providers: [OrderService, OrderListenerService],
})
export class OrderModule {}
