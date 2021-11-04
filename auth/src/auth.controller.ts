import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from '@ar-ticketing/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async register(body: RegisterDto) {
    return this.authService.register(body);
  }

  @MessagePattern('login')
  async login(body: LoginDto) {
    return this.authService.login(body);
  }

  @MessagePattern('logout')
  async logout() {
    return this.authService.logout();
  }

  @MessagePattern('validate_token')
  async validateToken(token: string) {
    return this.authService.validateToken(token);
  }
}
