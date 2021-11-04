import { LoginDto, RegisterDto, User } from '@ar-ticketing/common';
import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { SessionType } from '../types';
import { AuthService } from './auth.service';
import { User as GetUser } from './decorators/user.decorator';
import { UseAuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto, @Session() session: SessionType) {
    return this.authService.login(data, session);
  }

  @Post('register')
  async register(@Body() data: RegisterDto, @Session() session: SessionType) {
    return this.authService.register(data, session);
  }

  @Get('me')
  @UseAuthGuard()
  async me(@GetUser() user: User) {
    return user;
  }

  @Post('logout')
  @UseAuthGuard()
  async logout(@Session() session: SessionType) {
    return this.authService.logout(session);
  }
}
