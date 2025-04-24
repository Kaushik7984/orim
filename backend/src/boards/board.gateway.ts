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
      const users = this.boardUsers.get(boardId);
      if (users) {
        users.delete(userId);
        if (users.size === 0) {
          this.boardUsers.delete(boardId);
        }
      }
      client.to(boardId).emit('board:user-left', { userId });
      this.socketToUser.delete(client.id);

      // console.log(`Cleaned up user ${userId} from board ${boardId}`);
    }

    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('board:join')
  async handleJoinBoard(
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

    // Notify others
    client.to(boardId).emit('board:user-joined', { userId });

    // Send existing canvas state to joining user
    const board = await this.boardsService.findBoardById(boardId);
    if (board?.canvasData) {
      client.emit('board:sync', board.canvasData);
    }

    client.emit('board:joined-successfully', { boardId });

    console.log(`User ${userId} joined board ${boardId}`);
  }

  @SubscribeMessage('board:leave')
  handleLeaveBoard(
    client: Socket,
    @MessageBody() data: { boardId: string; userId: string },
  ) {
    client.leave(data.boardId);
    const users = this.boardUsers.get(data.boardId);
    if (users) {
      users.delete(data.userId);
      if (users.size === 0) {
        this.boardUsers.delete(data.boardId);
      }
    }
    this.socketToUser.delete(client.id);

    client.to(data.boardId).emit('board:user-left', { userId: data.userId });
    console.log(`User ${data.userId} left board ${data.boardId}`);
  }

  @SubscribeMessage('board:update')
  async handleBoardUpdate(
    client: Socket,
    @MessageBody()
    data: { boardId: string; content: any; canvasData: any; userId: string },
  ) {
    const { boardId, content, canvasData, userId } = data;

    if (!canvasData) {
      console.log('Canvas data is missing in the update');
      return;
    }

    // Save the update to DB
    await this.boardsService.updateBoard(boardId, { content, canvasData });

    // Broadcast to others
    client.to(boardId).emit('board:update', {
      content,
      canvasData,
      userId,
    });

    // Send the updated board data to the user who made the update
    const board = await this.boardsService.getBoardById(boardId);
    if (board?.canvasData) {
      client.emit('board:sync', board.canvasData);
    }

    console.log(`Board update from ${userId} on board ${boardId}`);
  }
}
