import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('RealtimeGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinOrderRoom')
  handleJoinOrderRoom(client: Socket, orderId: string) {
    this.logger.log(`Client ${client.id} joined room order_${orderId}`);
    client.join(`order_${orderId}`);
    return { event: 'joinedRoom', data: `order_${orderId}` };
  }

  @SubscribeMessage('joinUserRoom')
  handleJoinUserRoom(client: Socket, userId: string) {
    this.logger.log(`Client ${client.id} joined room user_${userId}`);
    client.join(`user_${userId}`);
    return { event: 'joinedRoom', data: `user_${userId}` };
  }

  broadcastOrderStatus(orderId: string, status: string, userId?: string) {
    this.logger.log(`Broadcasting status ${status} to room order_${orderId}`);
    this.server.to(`order_${orderId}`).emit('orderStatusUpdated', { orderId, status });
    
    if (userId) {
      this.logger.log(`Broadcasting status ${status} to room user_${userId}`);
      this.server.to(`user_${userId}`).emit('orderStatusUpdated', { orderId, status });
    }
  }
}
