import {
  CreateTicketDto,
  TicketClientProxy,
  UpdateTicketDto,
} from '@ar-ticketing/common';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { TICKETS_MICROSERVICE_PROVIDER } from '../shared/constants';

@Injectable()
export class TicketService {
  constructor(
    @Inject(TICKETS_MICROSERVICE_PROVIDER) private client: TicketClientProxy,
  ) {}

  async create(body: CreateTicketDto) {
    return firstValueFrom(this.client.send('create_ticket', body));
  }

  async update(id: string, body: UpdateTicketDto) {
    return firstValueFrom(this.client.send('update_ticket', { id, ...body }));
  }

  async get(id: string) {
    return firstValueFrom(this.client.send('get_ticket', id));
  }

  async all() {
    return firstValueFrom(this.client.send('all_tickets', {}));
  }
}
