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
  private boardUsers: Map<string, Set<string>> = new Map(); // boardId -> userIds
  private socketToUser: Map<string, { boardId: string; userId: string }> =
    new Map();

  constructor(private readonly boardsService: BoardsService) {}

  // Handle new client connections
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Reattach event listeners to the client upon connection
    client.on('board:join', (data) => this.handleJoinBoard(client, data));
    client.on('board:leave', (data) => this.handleLeaveBoard(client, data));
    client.on('board:update', (data) => this.handleBoardUpdate(client, data));
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    // Clean up when a client disconnects
    const userData = this.socketToUser.get(client.id);
    console.log('userdata', userData);
    if (userData) {
      const { boardId, userId } = userData;
      const users = this.boardUsers.get(boardId);
      if (users) {
        users.delete(userId);
        if (users.size === 0) {
          this.boardUsers.delete(boardId);
        }
      }
      // Emit an event to notify others that a user has left
      client.to(boardId).emit('board:user-left', { userId });
      this.socketToUser.delete(client.id);
    }
  }

  // Handle board join request
  @SubscribeMessage('board:join')
  async handleJoinBoard(
    client: Socket,
    @MessageBody() data: { boardId: string; userId: string },
  ) {
    if (!client || !client.id) {
      console.error('Client is undefined or disconnected');
      return;
    }

    const { boardId, userId } = data;

    if (!boardId || !userId) {
      console.error('Missing boardId or userId:', data);
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

      client.to(boardId).emit('board:user-joined', { userId });

      const board = await this.boardsService.findBoardById(boardId);
      if (board?.canvasData) {
        client.emit('board:sync', board.canvasData);
      }

      // Notify the client that the join was successful
      client.emit('board:joined-successfully', { boardId });
      console.log(`User ${userId} joined board ${boardId}`);
      console.log('data', data);
    } catch (error) {
      console.error('Error handling join request:', error);
      client.emit('error', { message: 'Error joining the board' });
    }
  }

  // Handle board leave request
  @SubscribeMessage('board:leave')
  async handleLeaveBoard(
    client: Socket,
    @MessageBody() data: { boardId: string; userId: string },
  ) {
    const { boardId, userId } = data;

    if (!client || !client.connected) {
      console.error(`Client ${client.id} is not connected`);
      client.emit('error', { message: 'Client is not connected' });
      return;
    }

    try {
      client.leave(boardId);

      const users = this.boardUsers.get(boardId);
      if (users) {
        users.delete(userId);
        if (users.size === 0) {
          this.boardUsers.delete(boardId);
        }
      }

      this.socketToUser.delete(client.id);

      // Emit an event to notify others that a user has left
      client.to(boardId).emit('board:user-left', { userId });
      console.log(`User ${userId} left board ${boardId}`);
    } catch (error) {
      console.error('Error handling leave request:', error);
      client.emit('error', { message: 'Error leaving the board' });
    }
  }

  // Handle board update
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

    try {
      // Save the update to the database
      await this.boardsService.updateBoard(boardId, { content, canvasData });

      // Broadcast the update to all users in the board room
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
    } catch (error) {
      console.error('Error handling board update:', error);
      client.emit('error', { message: 'Error updating the board' });
    }
  }
}
