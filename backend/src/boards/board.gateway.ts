import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BoardsService } from './boards.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private boardUsers: Map<string, Set<string>> = new Map(); // boardId -> userIds
  private socketToUser: Map<string, { boardId: string; userId: string }> =
    new Map();

  constructor(private readonly boardsService: BoardsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userData = this.socketToUser.get(client.id);
    if (userData) {
      const { boardId, userId } = userData;
      this.boardUsers.get(boardId)?.delete(userId);
      client.to(boardId).emit('board:user-left', { userId });
      console.log(`Cleaned up user ${userId} from board ${boardId}`);
      this.socketToUser.delete(client.id);
    }

    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('board:join')
  handleJoinBoard(
    client: Socket,
    @MessageBody() data: { boardId: string; userId: string },
  ) {
    const { boardId, userId } = data;

    client.join(boardId);

    if (!this.boardUsers.has(boardId)) {
      this.boardUsers.set(boardId, new Set());
    }
    this.boardUsers.get(boardId)?.add(userId);
    this.socketToUser.set(client.id, { boardId, userId });

    client.to(boardId).emit('board:user-joined', { userId });
    client.emit('board:joined-successfully', { boardId });

    console.log(`User ${userId} joined board ${boardId}`);
  }

  @SubscribeMessage('board:leave')
  handleLeaveBoard(
    client: Socket,
    @MessageBody() data: { boardId: string; userId: string },
  ) {
    client.leave(data.boardId);
    this.boardUsers.get(data.boardId)?.delete(data.userId);
    this.socketToUser.delete(client.id);

    client.to(data.boardId).emit('board:user-left', { userId: data.userId });
    console.log(`User ${data.userId} left board ${data.boardId}`);
  }

  @SubscribeMessage('board:update')
  async handleBoardUpdate(
    client: Socket,
    @MessageBody() data: { boardId: string; content: any; userId: string },
  ) {
    const { boardId, content, userId } = data;

    // Save the updated content to the database
    await this.boardsService.updateBoard(boardId, { content }, userId);

    // Emit the updated content to all users in the room
    client.to(boardId).emit('board:update', {
      content,
      userId,
    });

    console.log(`Board update from ${userId} on board ${boardId}`);
  }
}
