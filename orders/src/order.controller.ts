import {
  AllOrdersDto,
  CreateOrderDto,
  DeleteOrderDto,
  GetOrderDto,
  MicroserviceExceptionsFilter,
  MicroserviceValidationPipe,
} from '@ar-ticketing/common';
import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller()
@UseFilters(new MicroserviceExceptionsFilter())
@UsePipes(new MicroserviceValidationPipe())
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('all_orders')
  async getAllOrders(data: AllOrdersDto) {
    return this.orderService.all(data);
  }

  @MessagePattern('get_order')
  async getOrder(data: GetOrderDto) {
    return this.orderService.get(data);
  }

  @MessagePattern('create_order')
  async createOrder(data: CreateOrderDto) {
    return this.orderService.create(data);
  }

  @MessagePattern('cancel_order')
  async deleteOrder(data: DeleteOrderDto) {
    return this.orderService.cancel(data);
  }
}
