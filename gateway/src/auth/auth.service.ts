import { AuthClientProxy, LoginDto, RegisterDto } from '@ar-ticketing/common';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AUTH_MICROSERVICE_PROVIDER } from '../shared/constants';
import { SessionType } from '../types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_MICROSERVICE_PROVIDER) private client: AuthClientProxy,
  ) {}

  async validateToken(token: string) {
    return firstValueFrom(this.client.send('validate_token', token));
  }

  async login(body: LoginDto, session: SessionType) {
    const { user, token } = await firstValueFrom(
      this.client.send('login', body),
    );
    session.jwt = token;
    return user;
  }

  async register(body: RegisterDto, session: SessionType) {
    const { user, token } = await firstValueFrom(
      this.client.send('register', body),
    );
    session.jwt = token;
    return user;
  }

  async logout(session: SessionType) {
    session.jwt = null;
    return this.client.send('logout', {});
  }
}
