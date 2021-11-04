import { CreateOrderDto, User } from '@ar-ticketing/common';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OmitType } from '@nestjs/mapped-types';
import { UseAuthGuard } from '../auth/guards/auth.guard';
import { User as GetUser } from '../auth/decorators/user.decorator';

class CreateDto extends OmitType(CreateOrderDto, ['userId'] as const) {}

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseAuthGuard()
  async all(@GetUser() user: User) {
    return this.orderService.all({ userId: user.id });
  }

  @Get(':id')
  @UseAuthGuard()
  async findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.orderService.get({ id, userId: user.id });
  }

  @Post()
  @UseAuthGuard()
  async create(@Body() data: CreateDto, @GetUser() user: User) {
    return this.orderService.create({ ...data, userId: user.id });
  }

  @Delete(':id')
  @UseAuthGuard()
  async cancel(@Param('id') id: string, @GetUser() user: User) {
    return this.orderService.cancel({ id, userId: user.id });
  }
}
