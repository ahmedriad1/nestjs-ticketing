import {
  ExpirationCompleteEvent,
  PaymentCreatedEvent,
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from '@ar-ticketing/common';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { OrderListenerService } from './order-listener.service';

@Controller()
export class OrderListener {
  constructor(private readonly listenerService: OrderListenerService) {}

  @EventPattern(Subjects.TicketCreated)
  async handleTicketCreated(
    @Payload() data: TicketCreatedEvent,
    @Ctx() context: NatsStreamingContext,
  ) {
    return this.listenerService.handleCreated(data, context);
  }

  @EventPattern(Subjects.TicketUpdated)
  async handleTicketUpdated(
    @Payload() data: TicketUpdatedEvent,
    @Ctx() context: NatsStreamingContext,
  ) {
    return this.listenerService.handleUpdated(data, context);
  }

  @EventPattern(Subjects.ExpirationComplete)
  async handleExpirationComplete(
    @Payload() data: ExpirationCompleteEvent,
    @Ctx() context: NatsStreamingContext,
  ) {
    return this.listenerService.handleExpired(data, context);
  }

  @EventPattern(Subjects.PaymentCreated)
  async handlePaymentCreated(
    @Payload() data: PaymentCreatedEvent,
    @Ctx() context: NatsStreamingContext,
  ) {
    return this.listenerService.handlePaymentCreated(data, context);
  }
}
