import {
  ExpirationCompleteEvent,
  OrderCancelledEvent,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from '@ar-ticketing/common';
import {
  NatsStreamingContext,
  Publisher,
} from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderModel } from './models/order.model';
import { Ticket, TicketModel } from './models/ticket.model';

@Injectable()
export class OrderListenerService {
  private readonly logger = new Logger(OrderListenerService.name);

  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: TicketModel,
    @InjectModel(Order.name)
    private readonly orderModel: OrderModel,
    private readonly publisher: Publisher,
  ) {}

  async handlePaymentCreated(
    payload: PaymentCreatedEvent,
    ctx: NatsStreamingContext,
  ) {
    const order = await this.orderModel.findById(payload.orderId);

    if (!order) throw new Error('Order not found');

    order.set({ status: OrderStatus.Complete });
    await order.save();
    ctx.message.ack();
  }

  async handleCreated(payload: TicketCreatedEvent, ctx: NatsStreamingContext) {
    this.logger.log(`Ticket created: ${JSON.stringify(payload)}`);
    await this.ticketModel.create({
      _id: payload.id,
      title: payload.title,
      price: payload.price,
      ownerId: payload.ownerId,
    });
    ctx.message.ack();
  }

  async handleUpdated(payload: TicketUpdatedEvent, ctx: NatsStreamingContext) {
    this.logger.log(`Ticket updated: ${JSON.stringify(payload)}`);

    const ticket = await this.ticketModel.findByEvent(payload);

    if (!ticket) return;

    ticket.set({
      title: payload.title,
      price: payload.price,
      ownerId: payload.ownerId,
    });

    await ticket.save();
    ctx.message.ack();
  }

  async handleExpired(
    payload: ExpirationCompleteEvent,
    ctx: NatsStreamingContext,
  ) {
    const order = await this.orderModel
      .findById(payload.orderId)
      .populate('ticket');

    if (!order) throw new Error('Order not found');
    if (
      order.status === OrderStatus.Complete ||
      order.status === OrderStatus.Cancelled
    )
      return ctx.message.ack();

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    await this.publisher.emit<string, OrderCancelledEvent>(
      Subjects.OrderCancelled,
      {
        id: order._id,
        ticket: {
          id: order.ticket.id,
          title: order.ticket.title,
          price: order.ticket.price,
          ownerId: order.ticket.ownerId,
          version: order.ticket.version,
        },
        userId: order.userId,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        version: order.version,
      },
    );
    ctx.message.ack();
  }
}
