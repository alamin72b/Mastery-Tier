import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  // Inject the new AuthService instead of UsersService
  constructor(private readonly authService: AuthService) {}

  @Post('sync')
  async syncGoogleUser(
    @Body('email') email: string,
    @Body('name') name: string,
    @Body('avatar') avatar: string,
    @Body('googleId') googleId: string,
  ) {
    // This now returns the user AND the signed JWT accessToken
    return this.authService.syncAndSign(email, name, avatar, googleId);
  }
}
