import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
// Remove UsersController from here if it only had the sync route
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
