import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PAYMENTS_MICROSERVICE_PROVIDER } from '../shared/constants';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: PAYMENTS_MICROSERVICE_PROVIDER,
        transport: Transport.TCP,
        options: {
          host: 'payments-srv',
          port: 3000,
        },
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
