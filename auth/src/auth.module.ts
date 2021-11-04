import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, userModelFactory } from './models/user.model';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET is not defined');
        return { secret };
      },
    }),
    MongooseModule.forFeatureAsync([
      { name: User.name, useFactory: userModelFactory },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
