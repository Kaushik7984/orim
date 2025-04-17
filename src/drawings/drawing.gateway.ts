import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DrawingsService } from './drawings.service';

@WebSocketGateway()
export class DrawingGateway {
  @WebSocketServer()
  server: Server;

  private userRooms: Map<string, Set<string>> = new Map();
  private roomUsers: Map<string, Set<string>> = new Map();

  constructor(private drawingsService: DrawingsService) {}

  private ensureUserRooms(userId: string): Set<string> {
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, new Set());
    }
    return this.userRooms.get(userId)!;
  }

  private ensureRoomUsers(drawingId: string): Set<string> {
    if (!this.roomUsers.has(drawingId)) {
      this.roomUsers.set(drawingId, new Set());
    }
    return this.roomUsers.get(drawingId)!;
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, drawingId: string) {
    const userId = client.data.userId;
    this.ensureUserRooms(userId).add(drawingId);
    this.ensureRoomUsers(drawingId).add(userId);
    client.join(drawingId);
  }

  @SubscribeMessage('leave')
  handleLeave(client: Socket, drawingId: string) {
    const userId = client.data.userId;
    const userRooms = this.userRooms.get(userId);
    const roomUsers = this.roomUsers.get(drawingId);

    if (userRooms) {
      userRooms.delete(drawingId);
    }
    if (roomUsers) {
      roomUsers.delete(userId);
    }
    client.leave(drawingId);
  }

  @SubscribeMessage('draw')
  async handleDraw(@MessageBody() data: { drawingId: string; path: any }) {
    const { drawingId, path } = data;
    await this.drawingsService.update(drawingId, { $push: { paths: path } });
    this.server.to(drawingId).emit('draw', path);
  }
} 