import {
  AllOrdersDto,
  CreateOrderDto,
  DeleteOrderDto,
  GetOrderDto,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
  OrderCancelledEvent,
} from '@ar-ticketing/common';
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { firstValueFrom } from 'rxjs';
import { Order, OrderDocument, OrderModel } from './models/order.model';
import { Ticket, TicketDocument, TicketModel } from './models/ticket.model';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

@Injectable()
export class OrderService {
  private readonly logger = new Logger('OrderService');

  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: OrderModel,
    @InjectModel(Ticket.name)
    private readonly ticketModel: TicketModel,
    private readonly publisher: Publisher,
  ) {}

  async all(data: AllOrdersDto) {
    const res = await this.orderModel
      .find({ userId: data.userId })
      .populate('ticket');
    return res;
  }

  async get(data: GetOrderDto): Promise<OrderDocument> {
    const order = await this.orderModel.findOne({
      _id: data.id,
      userId: data.userId,
    });
    if (!order) throw new NotFoundException('Order not found !');

    return order.populate('ticket');
  }

  async create(data: CreateOrderDto): Promise<OrderDocument> {
    const ticket = await this.ticketModel.findById(data.ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found !');

    if (await ticket.isReserved())
      throw new BadRequestException('Ticket is reserved !');

    const expiration = new Date();
    // Add 15 minutes
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = await this.orderModel.create({
      ticket,
      userId: data.userId,
      expiresAt: expiration,
      status: OrderStatus.Created,
    });

    const gid = await firstValueFrom(
      this.publisher.emit<string, OrderCreatedEvent>(
        Subjects.OrderCreated,
        this._toEventBody(order, ticket),
      ),
    );

    this.logger.log(`Emmited event with gid: ${gid}`);

    return order;
  }

  async cancel(data: DeleteOrderDto): Promise<OrderDocument> {
    const order = await this.orderModel
      .findOne({
        id: data.id,
        userId: data.userId,
        status: {
          $ne: OrderStatus.Cancelled,
        },
      })
      .populate('ticket');

    if (!order) throw new NotFoundException('Order not found !');

    order.status = OrderStatus.Cancelled;
    await order.save();

    this.publisher.emit<string, OrderCancelledEvent>(
      Subjects.OrderCancelled,
      this._toEventBody(order),
    );

    return order;
  }

  private _toEventBody(order: OrderDocument, ticket?: TicketDocument) {
    let currentTicket = ticket;
    if (!currentTicket) currentTicket = order.ticket as TicketDocument;

    return {
      id: order._id,
      ticket: {
        id: currentTicket.id,
        title: currentTicket.title,
        price: currentTicket.price,
        ownerId: currentTicket.ownerId,
        version: currentTicket.version,
      },
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
    };
  }
}
