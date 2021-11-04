import {
  CreatePaymentDto,
  MicroserviceExceptionsFilter,
  MicroserviceValidationPipe,
} from '@ar-ticketing/common';
import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
@UseFilters(new MicroserviceExceptionsFilter())
@UsePipes(new MicroserviceValidationPipe())
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('create_payment')
  async createPayment(data: CreatePaymentDto) {
    return this.paymentService.create(data);
  }
}
