import { OrderCreatedEvent, Subjects } from '@ar-ticketing/common';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { InjectQueue } from '@nestjs/bull';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { Queue } from 'bull';
import { JobPayload } from '../types';

@Controller()
export class ExpirationController {
  constructor(
    @InjectQueue('expiration')
    private readonly expirationQueue: Queue<JobPayload>,
  ) {}

  @EventPattern(Subjects.OrderCreated)
  async handleOrderCreated(
    @Payload() data: OrderCreatedEvent,
    @Ctx() context: NatsStreamingContext,
  ) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await this.expirationQueue.add({ orderId: data.id }, { delay });
    context.message.ack();
  }
}
