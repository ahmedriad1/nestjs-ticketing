import { Module } from '@nestjs/common';
import { CookieSessionModule } from 'nestjs-cookie-session';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { TicketModule } from './ticket/ticket.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    CookieSessionModule.forRoot({
      session: { signed: false, secure: process.env.NODE_ENV !== 'test' },
    }),
    AuthModule,
    TicketModule,
    OrderModule,
    PaymentModule,
  ],
})
export class AppModule {}
