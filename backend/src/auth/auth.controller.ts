import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // <--- Must be exactly 'auth'
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google/sync') // <--- Must be exactly 'google/sync'
  async syncGoogleUser(
    @Body('email') email: string,
    @Body('name') name: string,
    @Body('avatar') avatar: string,
    @Body('googleId') googleId: string,
  ) {
    return this.authService.syncAndSign(email, name, avatar, googleId);
  }
}
