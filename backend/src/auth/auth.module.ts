import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller'; // 1. Import it here
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController], // 2. IT MUST BE LISTED HERE!
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
