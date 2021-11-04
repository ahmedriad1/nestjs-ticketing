import {
  OrderClientProxy,
  CreateOrderDto,
  AllOrdersDto,
  GetOrderDto,
  DeleteOrderDto,
} from '@ar-ticketing/common';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ORDERS_MICROSERVICE_PROVIDER } from '../shared/constants';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDERS_MICROSERVICE_PROVIDER) private client: OrderClientProxy,
  ) {}

  async all(data: AllOrdersDto) {
    return firstValueFrom(this.client.send('all_orders', data));
  }

  async get(data: GetOrderDto) {
    return firstValueFrom(this.client.send('get_order', data));
  }

  async create(body: CreateOrderDto) {
    return firstValueFrom(this.client.send('create_order', body));
  }

  async cancel(body: DeleteOrderDto) {
    return firstValueFrom(this.client.send('cancel_order', body));
  }
}
