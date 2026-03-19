import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async syncAndSign(
    email: string,
    name: string,
    avatar: string,
    googleId: string,
  ) {
    // 1. Save or update the user in the Neon database
    const user = await this.usersService.syncUser(
      email,
      name,
      avatar,
      googleId,
    );

    // 2. Create a secure payload using the database UUID
    const payload = { sub: user.id, email: user.email };

    // 3. Return both the user data and the new backend token
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
