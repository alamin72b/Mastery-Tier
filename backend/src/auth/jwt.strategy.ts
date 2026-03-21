import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// 1. Define the exact shape of the payload to fix the "any" assignment errors
interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 2. Add the "!" to assert to TypeScript that this variable definitely exists
      secretOrKey: process.env.AUTH_SECRET!,
    });
  }

  // 3. Remove "async" since there are no asynchronous database calls here
  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
