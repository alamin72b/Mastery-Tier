import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async syncUser(
    email: string,
    name: string,
    avatar: string,
    googleId: string,
  ) {
    // Upsert guarantees the user will exist in the database after this runs
    return this.prisma.user.upsert({
      where: { email },
      update: { name, avatar, googleId },
      create: { email, name, avatar, googleId },
    });
  }
}
