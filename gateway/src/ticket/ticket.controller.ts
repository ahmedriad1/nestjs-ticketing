import { CreateTicketDto, UpdateTicketDto, User } from '@ar-ticketing/common';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { OmitType } from '@nestjs/mapped-types';
import { UseAuthGuard } from '../auth/guards/auth.guard';
import { User as GetUser } from '../auth/decorators/user.decorator';

class CreateDto extends OmitType(CreateTicketDto, ['ownerId'] as const) {}

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async all() {
    return this.ticketService.all();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ticketService.get(id);
  }

  @Post()
  @UseAuthGuard()
  async create(@Body() data: CreateDto, @GetUser() user: User) {
    return this.ticketService.create({ ...data, ownerId: user.id });
  }

  @Patch(':id')
  @UseAuthGuard()
  async update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() data: UpdateTicketDto,
  ) {
    const ticket = await this.ticketService.get(id);
    if (ticket.ownerId !== user.id)
      throw new UnauthorizedException('You are not the ticket owner !');
    return this.ticketService.update(id, data);
  }
}
