import { PaymentClientProxy, CreatePaymentDto } from '@ar-ticketing/common';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PAYMENTS_MICROSERVICE_PROVIDER } from '../shared/constants';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENTS_MICROSERVICE_PROVIDER) private client: PaymentClientProxy,
  ) {}

  async create(body: CreatePaymentDto) {
    return firstValueFrom(this.client.send('create_payment', body));
  }
}
