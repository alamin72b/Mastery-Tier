import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { FriendsModule } from './friends/friends.module';
import { PrismaModule } from './prisma/prisma.module';
import { OutboxModule } from './outbox/outbox.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CategoriesModule,
    SubCategoriesModule,
    FriendsModule,
    OutboxModule,
  ],
})
export class AppModule {}
