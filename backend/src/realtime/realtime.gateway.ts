import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket as BaseSocket } from 'socket.io';
import { RealtimeOutboundEvent, userRoom } from './realtime-event.types';

type JwtUserPayload = {
  sub?: string;
  userId?: string;
  id?: string;
  email?: string;
};

type SocketData = {
  userId?: string;
};

type Socket = BaseSocket & { data: SocketData };

@Injectable()
@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: '/realtime',
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);

      if (!token) {
        throw new UnauthorizedException('Missing socket token');
      }

      const payload = await this.jwtService.verifyAsync<JwtUserPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = this.extractUserId(payload);

      if (!userId) {
        throw new UnauthorizedException('Invalid socket token payload');
      }

      (client.data as SocketData).userId = userId;
      await client.join(userRoom(userId));

      this.logger.log(
        `Socket connected: socketId=${client.id} userId=${userId}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Socket authentication failed';

      this.logger.warn(
        `Socket rejected: socketId=${client.id} reason=${message}`,
      );

      client.emit('error', { message: 'Unauthorized' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client.data as SocketData).userId;

    this.logger.log(
      `Socket disconnected: socketId=${client.id} userId=${userId ?? 'unknown'}`,
    );
  }

  emitToUser(
    userId: string,
    event: RealtimeOutboundEvent,
    payload: Record<string, unknown>,
  ) {
    this.server.to(userRoom(userId)).emit(event, payload);
  }

  private extractToken(client: Socket): string | null {
    const authTokenRaw = client.handshake.auth?.token as unknown;
    const authToken = typeof authTokenRaw === 'string' ? authTokenRaw : null;
    if (authToken && authToken.length > 0) {
      return this.normalizeToken(authToken);
    }

    const authorizationHeaderRaw = client.handshake.headers
      .authorization as unknown;
    const authorizationHeader =
      typeof authorizationHeaderRaw === 'string'
        ? authorizationHeaderRaw
        : null;
    if (authorizationHeader && authorizationHeader.length > 0) {
      return this.normalizeToken(authorizationHeader);
    }

    const queryTokenRaw = client.handshake.query?.token as unknown;
    const queryToken = typeof queryTokenRaw === 'string' ? queryTokenRaw : null;
    if (queryToken && queryToken.length > 0) {
      return this.normalizeToken(queryToken);
    }

    return null;
  }

  private normalizeToken(value: string): string {
    if (value.startsWith('Bearer ')) {
      return value.slice('Bearer '.length).trim();
    }

    return value.trim();
  }

  private extractUserId(payload: JwtUserPayload): string | null {
    if (typeof payload.sub === 'string' && payload.sub.length > 0) {
      return payload.sub;
    }

    if (typeof payload.userId === 'string' && payload.userId.length > 0) {
      return payload.userId;
    }

    if (typeof payload.id === 'string' && payload.id.length > 0) {
      return payload.id;
    }

    return null;
  }
}
