import { IsIn } from 'class-validator';

export class RespondFriendRequestDto {
  @IsIn(['accept', 'decline'], {
    message: 'Action must be either accept or decline',
  })
  action: 'accept' | 'decline';
}
