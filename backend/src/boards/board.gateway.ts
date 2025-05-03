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
  @WebSocketServer() server: Server;

  // Maps to track users and sockets associated with board sessions
  private boardUsers: Map<string, Set<string>> = new Map(); // boardId -> userIds
  private socketToUser: Map<string, { boardId: string; userId: string }> =
    new Map();

  constructor(private readonly boardsService: BoardsService) {}

  // Handle client connection and register socket events
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    client.on('board:join', (data) => this.handleJoinBoard(client, data));
    client.on('board:leave', (data) => this.handleLeaveBoard(client, data));
    client.on('board:update', (data) => this.handleBoardUpdate(client, data));
  }

  // Handle client disconnection and cleanup user from board
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    const userData = this.socketToUser.get(client.id);
    if (userData) {
      const { boardId, userId } = userData;
      const users = this.boardUsers.get(boardId);
      if (users) {
        users.delete(userId);
        if (users.size === 0) this.boardUsers.delete(boardId);
      }
      client.to(boardId).emit('board:user-left', { userId });
      this.socketToUser.delete(client.id);
    }
  }

  // Handle user joining a board
  @SubscribeMessage('board:join')
  async handleJoinBoard(
    client: Socket,
    @MessageBody() data: { boardId: string; userId: string },
  ) {
    const { boardId, userId } = data;

    if (!boardId || !userId) {
      client.emit('error', { message: 'Invalid boardId or userId' });
      return;
    }

    try {
      client.join(boardId);

      if (!this.boardUsers.has(boardId)) {
        this.boardUsers.set(boardId, new Set());
      }

      this.boardUsers.get(boardId)?.add(userId);
      this.socketToUser.set(client.id, { boardId, userId });

      // Notify others in the board room
      client.to(boardId).emit('board:user-joined', { userId });

      // Send current board state to the joining user
      const board = await this.boardsService.findBoardById(boardId);
      if (board?.canvasData) {
        client.emit('board:sync', board.canvasData);
      }

      client.emit('board:joined-successfully', { boardId });
      console.log(`User ${userId} joined board ${boardId}`);
    } catch (error) {
      console.error('Error joining board:', error);
      client.emit('error', { message: 'Error joining the board' });
    }
  }

  // Handle user leaving a board
  @SubscribeMessage('board:leave')
  async handleLeaveBoard(
    client: Socket,
    @MessageBody() data: { boardId: string; userId: string },
  ) {
    const { boardId, userId } = data;

    try {
      client.leave(boardId);

      const users = this.boardUsers.get(boardId);
      if (users) {
        users.delete(userId);
        if (users.size === 0) this.boardUsers.delete(boardId);
      }

      this.socketToUser.delete(client.id);

      // Notify others in the room
      client.to(boardId).emit('board:user-left', { userId });
      console.log(`User ${userId} left board ${boardId}`);
    } catch (error) {
      console.error('Error leaving board:', error);
      client.emit('error', { message: 'Error leaving the board' });
    }
  }

  // Handle real-time board update from user
  @SubscribeMessage('board:update')
  async handleBoardUpdate(
    client: Socket,
    @MessageBody()
    data: { boardId: string; content: any; canvasData: any; userId: string },
  ) {
    const { boardId, canvasData, userId } = data;

    if (!canvasData) return;

    try {
      // Persist update to database
      await this.boardsService.updateBoard(boardId, { canvasData });

      // Broadcast update to other users
      client.to(boardId).emit('board:update', { canvasData, userId });

      // Send updated board state back to sender
      const board = await this.boardsService.getBoardById(boardId);
      if (board?.canvasData) {
        client.emit('board:sync', board.canvasData);
      }

      console.log(`Board updated by ${userId} on board ${boardId}`);
    } catch (error) {
      console.error('Error updating board:', error);
      client.emit('error', { message: 'Error updating the board' });
    }
  }
}
