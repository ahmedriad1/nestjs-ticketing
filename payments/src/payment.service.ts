import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreatePaymentDto,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@ar-ticketing/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderModel } from './models/order.model';
import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import Stripe from 'stripe';
import { Payment, PaymentModel } from './models/payment.model';
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: OrderModel,
    @InjectModel(Payment.name) private readonly paymentModel: PaymentModel,
    @InjectStripeClient() private readonly stripeClient: Stripe,
    private readonly publisher: Publisher,
  ) {}

  async create(data: CreatePaymentDto) {
    const order = await this.orderModel.findOne({
      _id: data.orderId,
      userId: data.userId,
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestException('Cannot pay for a cancelled order');
    if (order.status === OrderStatus.Complete)
      throw new BadRequestException('Cannot pay for a complete order');

    const charge = await this.stripeClient.charges.create({
      currency: 'usd',
      amount: order.price * 100, // in cents
      source: data.token,
    });

    const payment = await this.paymentModel.create({
      orderId: order.id,
      stripeId: charge.id,
    });

    order.set({ status: OrderStatus.Complete });
    await order.save();

    await this.publisher.emit<Subjects, PaymentCreatedEvent>(
      Subjects.PaymentCreated,
      { id: payment.id, orderId: payment.orderId, stripeId: payment.stripeId },
    );

    return { id: payment.id };
  }
}
