import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/orders',
  cors: { origin: true, credentials: true },
})
export class OrdersGateway implements OnGatewayConnection {
  private readonly logger = new Logger(OrdersGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    const raw =
      (client.handshake.auth as { token?: string })?.token ||
      (typeof client.handshake.headers.authorization === 'string'
        ? client.handshake.headers.authorization.replace(/^Bearer\s+/i, '')
        : undefined);
    if (!raw) {
      this.logger.warn('WS client rejected: missing token');
      client.disconnect(true);
      return;
    }
    try {
      const payload = this.jwt.verify<{ sub: string }>(raw, {
        secret: this.config.get<string>('JWT_SECRET') || 'super-secret-key',
      });
      void client.join(`user:${payload.sub}`);
    } catch {
      this.logger.warn('WS client rejected: invalid token');
      client.disconnect(true);
    }
  }

  emitOrderStatus(userId: string, payload: { orderId: string; status: string }) {
    this.server.to(`user:${userId}`).emit('order:status', payload);
  }
}
