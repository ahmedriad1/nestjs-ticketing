import {
  CreateTicketDto,
  MicroserviceExceptionsFilter,
  MicroserviceValidationPipe,
  UpdateTicketWithIdDto,
} from '@ar-ticketing/common';
import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TicketService } from './ticket.service';

@Controller()
@UseFilters(new MicroserviceExceptionsFilter())
@UsePipes(new MicroserviceValidationPipe())
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @MessagePattern('get_ticket')
  async getTicket(id: string) {
    return this.ticketService.get(id);
  }

  @MessagePattern('all_tickets')
  async allTickets() {
    return this.ticketService.all();
  }

  @MessagePattern('create_ticket')
  async createTicket(body: CreateTicketDto) {
    return this.ticketService.create(body);
  }

  @MessagePattern('update_ticket')
  async updateTicket(body: UpdateTicketWithIdDto) {
    return this.ticketService.update(body);
  }
}
