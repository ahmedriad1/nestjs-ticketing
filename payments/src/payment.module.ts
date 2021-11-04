import { NatsPublisherConfig } from '@ar-ticketing/common';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderModelFactory } from './models/order.model';
import { Payment, paymentModelFactory } from './models/payment.model';
import { OrderListener } from './order.listener';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: orderModelFactory,
      },
      {
        name: Payment.name,
        useFactory: paymentModelFactory,
      },
    ]),
    NatsStreamingTransport.registerAsync({
      useFactory: async () => new NatsPublisherConfig().toJSON(),
    }),
    StripeModule.forRootAsync(StripeModule, {
      useFactory: async () => {
        if (!process.env.STRIPE_KEY)
          throw new Error('STRIPE_KEY is not defined');

        return {
          apiKey: process.env.STRIPE_KEY,
          webhookConfig: {
            stripeWebhookSecret: 'super-secret',
          },
        };
      },
    }),
  ],
  controllers: [PaymentController, OrderListener],
  providers: [PaymentService],
})
export class PaymentModule {}
