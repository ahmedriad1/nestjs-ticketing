import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_MICROSERVICE_PROVIDER } from '../shared/constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_MICROSERVICE_PROVIDER,
        transport: Transport.TCP,
        options: {
          host: 'auth-srv',
          port: 3000,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
