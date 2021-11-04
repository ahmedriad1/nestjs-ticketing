import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@ar-ticketing/common';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderModel } from './models/order.model';

@Controller()
export class OrderListener {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: OrderModel,
  ) {}

  @EventPattern(Subjects.OrderCreated)
  async handleOrderCreated(
    @Payload() data: OrderCreatedEvent,
    @Ctx() ctx: NatsStreamingContext,
  ) {
    await this.orderModel.create({
      _id: data.id,
      userId: data.userId,
      price: data.ticket.price,
      status: data.status,
      version: data.version,
    });
    ctx.message.ack();
  }

  @EventPattern(Subjects.OrderCancelled)
  async handleOrderCancelled(
    @Payload() data: OrderCancelledEvent,
    @Ctx() ctx: NatsStreamingContext,
  ) {
    const order = await this.orderModel.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) throw new Error('Order not found');
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    ctx.message.ack();
  }
}
