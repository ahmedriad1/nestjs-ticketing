import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  Subjects,
} from '@ar-ticketing/common';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { OrderEventListenerService } from './order-event-listener.service';

@Controller()
export class OrderEventListenerController {
  constructor(private readonly listenerService: OrderEventListenerService) {}

  @EventPattern(Subjects.OrderCreated)
  async handleOrderCreated(
    @Payload() data: OrderCreatedEvent,
    @Ctx() context: NatsStreamingContext,
  ) {
    return this.listenerService.handleCreated(data, context);
  }

  @EventPattern(Subjects.OrderCancelled)
  async handleOrderCancelled(
    @Payload() data: OrderCancelledEvent,
    @Ctx() context: NatsStreamingContext,
  ) {
    return this.listenerService.handleCancelled(data, context);
  }
}
