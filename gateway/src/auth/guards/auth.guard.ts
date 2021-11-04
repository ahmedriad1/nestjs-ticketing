import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionType } from '../../types';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session as SessionType;

    if (!session.jwt) throw new UnauthorizedException('Invalid token');

    const user = await this.authService.validateToken(session.jwt);

    request.user = user;
    return true;
  }
}

export const UseAuthGuard = () => UseGuards(AuthGuard);
