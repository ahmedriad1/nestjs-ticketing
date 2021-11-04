import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ORDERS_MICROSERVICE_PROVIDER } from '../shared/constants';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: ORDERS_MICROSERVICE_PROVIDER,
        transport: Transport.TCP,
        options: {
          host: 'orders-srv',
          port: 3000,
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
