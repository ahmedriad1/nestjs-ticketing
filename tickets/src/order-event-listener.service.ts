import {
  NatsStreamingContext,
  Publisher,
} from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument, TicketModel } from './models/ticket.model';
import {
  OrderCreatedEvent,
  OrderCancelledEvent,
  TicketUpdatedEvent,
  Subjects,
} from '@ar-ticketing/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderEventListenerService {
  private readonly logger = new Logger('OrderEventListenerService');

  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: TicketModel,
    private publisher: Publisher,
  ) {}

  private _toEventBody(ticket: TicketDocument) {
    return {
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      ownerId: ticket.ownerId,
      version: ticket.version,
    };
  }

  async handleCreated(payload: OrderCreatedEvent, ctx: NatsStreamingContext) {
    this.logger.log(`Order created: ${JSON.stringify(payload)}`);
    const ticket = await this.ticketModel.findById(payload.ticket.id);
    if (!ticket) throw new Error('Ticket not found');

    ticket.set({ orderId: payload.id });
    await ticket.save();

    const gid = await firstValueFrom(
      this.publisher.emit<string, TicketUpdatedEvent>(
        Subjects.TicketUpdated,
        this._toEventBody(ticket),
      ),
    );
    this.logger.log(`Event published with gid: ${gid}`);

    ctx.message.ack();
  }

  async handleCancelled(
    payload: OrderCancelledEvent,
    ctx: NatsStreamingContext,
  ) {
    this.logger.log(`Order cancelled: ${JSON.stringify(payload)}`);

    const ticket = await this.ticketModel.findById(payload.ticket.id);
    if (!ticket) throw new Error('Ticket not found');

    ticket.set({ orderId: undefined });
    await ticket.save();

    const gid = await firstValueFrom(
      this.publisher.emit<string, TicketUpdatedEvent>(
        Subjects.TicketUpdated,
        this._toEventBody(ticket),
      ),
    );
    this.logger.log(`Event published with gid: ${gid}`);

    ctx.message.ack();
  }
}
