import { CreatePaymentDto, User } from '@ar-ticketing/common';
import { Body, Controller, Post } from '@nestjs/common';
import { OmitType } from '@nestjs/mapped-types';
import { UseAuthGuard } from '../auth/guards/auth.guard';
import { User as GetUser } from '../auth/decorators/user.decorator';
import { PaymentService } from './payment.service';

class CreateDto extends OmitType(CreatePaymentDto, ['userId'] as const) {}

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseAuthGuard()
  async create(@Body() data: CreateDto, @GetUser() user: User) {
    return this.paymentService.create({ userId: user.id, ...data });
  }
}
