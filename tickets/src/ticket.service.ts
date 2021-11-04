import {
  CreateTicketDto,
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
  UpdateTicketWithIdDto,
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
import { Ticket, TicketDocument, TicketModel } from './models/ticket.model';

@Injectable()
export class TicketService {
  private readonly logger = new Logger('TicketService');

  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: TicketModel,
    private publisher: Publisher,
  ) {}

  async all() {
    return this.ticketModel.find({ orderId: undefined });
  }

  async get(id: string) {
    try {
      const ticket = await this.ticketModel.findById(id);
      if (!ticket) throw new NotFoundException('Ticket not found');
      return ticket;
    } catch {
      throw new NotFoundException('Ticket not found');
    }
  }

  private _ticketToEventPayload(ticket: TicketDocument) {
    return {
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      ownerId: ticket.ownerId,
      version: ticket.version,
      orderId: ticket.orderId,
    };
  }

  async create(data: CreateTicketDto): Promise<TicketDocument> {
    const ticket = new this.ticketModel(data);
    await ticket.save();
    const gid = await firstValueFrom(
      this.publisher.emit<string, TicketCreatedEvent>(
        Subjects.TicketCreated,
        this._ticketToEventPayload(ticket),
      ),
    );
    this.logger.log(`Event published with gid: ${gid}`);
    return ticket;
  }

  async update({ id, ...body }: UpdateTicketWithIdDto) {
    const ticket = await this.ticketModel.findById(id);
    if (!ticket) throw new NotFoundException('Ticket not found');

    if (ticket.orderId) throw new BadRequestException('Ticket is reserved');

    const data: any = {};
    if (body.title) data.title = body.title;
    if (body.price) data.price = body.price;
    ticket.set(data);
    await ticket.save();

    this.publisher.emit<string, TicketUpdatedEvent>(
      Subjects.TicketUpdated,
      this._ticketToEventPayload(ticket),
    );

    return ticket;
  }
}
