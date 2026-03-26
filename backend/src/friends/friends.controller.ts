import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { RespondFriendRequestDto } from './dto/respond-friend-request.dto';
import { FriendsService } from './friends.service';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('friends')
@UseGuards(AuthGuard('jwt'))
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get('discover')
  async discover(
    @Req() req: RequestWithUser,
    @Query('email') email: string = '',
  ) {
    return this.friendsService.searchUsersByEmail(req.user.userId, email);
  }

  @Post('requests')
  async createRequest(
    @Req() req: RequestWithUser,
    @Body() dto: CreateFriendRequestDto,
  ) {
    return this.friendsService.sendFriendRequest(req.user.userId, dto.email);
  }

  @Get('requests')
  async getRequests(@Req() req: RequestWithUser) {
    return this.friendsService.getPendingRequests(req.user.userId);
  }

  @Patch('requests/:id')
  async respond(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: RespondFriendRequestDto,
  ) {
    return this.friendsService.respondToFriendRequest(
      req.user.userId,
      id,
      dto.action,
    );
  }

  @Get()
  async getFriends(@Req() req: RequestWithUser) {
    return this.friendsService.getFriendsWithProgress(req.user.userId);
  }
}
