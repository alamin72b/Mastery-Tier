import { IsEmail } from 'class-validator';

export class CreateFriendRequestDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
