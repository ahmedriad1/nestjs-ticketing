import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from './types';
import { User, UserModel } from './models/user.model';
import { LoginDto, RegisterDto } from '@ar-ticketing/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserModel,
    private readonly jwtService: JwtService,
  ) {}

  async validateToken(token: string) {
    if (!token || !(await this.jwtService.verifyAsync(token)))
      throw new UnauthorizedException('Invalid token');

    const decoded = this.jwtService.decode(token) as JwtPayload;

    const user = await this.userModel.findById(decoded.id);
    if (!user) throw new UnauthorizedException('Invalid token');

    return user;
  }

  async register(body: RegisterDto) {
    if (await this.userModel.exists({ email: body.email }))
      throw new BadRequestException('Email already exists');

    const user = new this.userModel(body);
    try {
      await user.save();
      const token = await this._signToken({ id: user.id });

      return { user, token };
    } catch (err) {
      if (err.message.includes('E11000'))
        throw new BadRequestException('Email already exists');
      throw err;
    }
  }

  async login(body: LoginDto) {
    const user = await this.userModel.findOne({ email: body.email });

    if (!user || !(await user.isValidPassword(body.password)))
      throw new UnauthorizedException('Invalid credentials');

    const token = await this._signToken({ id: user.id });

    return { user, token };
  }

  async logout() {
    return null;
  }

  private async _signToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }
}
