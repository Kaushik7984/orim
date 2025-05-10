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
  private socketToUser: Map<
    string,
    { boardId: string; userId: string; username: string }
  > = new Map();
  // Add a new map to track board owners
  private boardOwners: Map<string, string> = new Map(); // boardId -> ownerId

  constructor(private readonly boardsService: BoardsService) {}

  // Handle client connection and register socket events
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    client.on('board:join', (data) => this.handleJoinBoard(client, data)); //for join board
    client.on('board:leave', (data) => this.handleLeaveBoard(client, data));
    // client.on('board:update', (data) => this.handleBoardUpdate(client, data));
    // client.on('board:get-users', (data) => this.handleGetUsers(client, data));
    client.on('cursor:move', (data) => this.handleCursorMove(client, data)); // for cursor move
    client.on('shape:add', (data) => this.handleShapeAdd(client, data)); // live sync(add shapes on board)
    client.on('shape:modify', (data) => this.handleShapeModify(client, data)); //live sync (change position of shape)
    client.on('shape:delete', (data) => this.handleShapeDelete(client, data)); //live sync (delete shape)
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
    @MessageBody()
    data: {
      boardId: string;
      userId: string;
      username: string;
      isOwner?: boolean;
    },
  ) {
    const { boardId, userId, username, isOwner } = data;

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
      this.socketToUser.set(client.id, {
        boardId,
        userId,
        username: username || 'Anonymous',
      });

      // If this user is the board owner, track them
      if (isOwner) {
        this.boardOwners.set(boardId, userId);
        console.log(
          `User ${username || userId} is the owner of board ${boardId}`,
        );
      }

      // Notify others in the board room
      client.to(boardId).emit('board:user-joined', {
        userId,
        username: username || 'Anonymous',
        isOwner,
      });

      // Send current board state to the joining user
      const board = await this.boardsService.findBoardById(boardId);
      if (board?.canvasData) {
        client.emit('board:sync', board.canvasData);
      }

      client.emit('board:joined-successfully', { boardId });
      console.log(`User ${username || userId} joined board ${boardId}`);
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

      // Need at least one await to satisfy linter
      await Promise.resolve();
    } catch (error) {
      console.error('Error leaving board:', error);
      client.emit('error', { message: 'Error leaving the board' });
    }
  }

  // Handle real-time board update from user
  // @SubscribeMessage('board:update')
  // async handleBoardUpdate(
  //   client: Socket,
  //   @MessageBody()
  //   data: {
  //     boardId: string;
  //     canvasData: Record<string, unknown>;
  //     userId: string;
  //     isOwner?: boolean;
  //   },
  // ) {
  //   const { boardId, canvasData, userId, isOwner } = data;

  //   if (!canvasData) return;

  //   try {
  //     // Only persist update to database if it comes from the board owner
  //     const isActualOwner = isOwner || this.boardOwners.get(boardId) === userId;

  //     if (isActualOwner) {
  //       // Persist update to database
  //       await this.boardsService.updateBoard(boardId, { canvasData });
  //       console.log(`Board updated by owner ${userId} and saved to database`);
  //     } else {
  //       console.log(
  //         `Canvas update from non-owner ${userId} - not saving to database`,
  //       );
  //     }

  //     // Broadcast update to other users regardless of who sent it
  //     client.to(boardId).emit('board:update', { canvasData, userId });

  //     console.log(`Board update broadcast from ${userId} on board ${boardId}`);
  //   } catch (error) {
  //     console.error('Error updating board:', error);
  //     client.emit('error', { message: 'Error updating the board' });
  //   }
  // }

  // Handle requests for the latest board state (for session mode collaborators)
  // @SubscribeMessage('board:request-latest-state')
  // async handleRequestLatestState(
  //   client: Socket,
  //   @MessageBody() data: { boardId: string },
  // ) {
  //   const { boardId } = data;

  //   if (!boardId) {
  //     client.emit('error', { message: 'Invalid boardId' });
  //     return;
  //   }

  //   try {
  //     // Get user info for the requesting client
  //     const userInfo = this.socketToUser.get(client.id);

  //     // Fetch the latest board state from the database
  //     const board = await this.boardsService.findBoardById(boardId);

  //     if (board?.canvasData) {
  //       // If user is a collaborator and not the owner, send them the latest state
  //       if (userInfo && userInfo.boardId === boardId) {
  //         console.log(
  //           `Sending latest board state to user ${userInfo.userId} for board ${boardId}`,
  //         );
  //         client.emit('board:sync', board.canvasData);
  //       }
  //     } else {
  //       console.log(`No canvas data found for board ${boardId}`);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching latest board state:', error);
  //     client.emit('error', {
  //       message: 'Error fetching the latest board state',
  //     });
  //   }
  // }

  // Handle shape add event
  @SubscribeMessage('shape:add')
  handleShapeAdd(
    client: Socket,
    @MessageBody()
    data: {
      boardId: string;
      shape: Record<string, unknown>;
      type: string;
      userId: string;
      isOwner: boolean;
    },
  ) {
    const { boardId, shape, type, userId, isOwner } = data;

    if (!boardId || !shape) {
      client.emit('error', { message: 'Invalid boardId or shape data' });
      return;
    }

    try {
      // De-duplicate before broadcasting
      if (this.isShapeDuplicate(shape)) {
        console.log(
          `Duplicate shape detected: ${String(shape.id)}, skipping broadcast`,
        );
        return;
      }

      // Only broadcast to others in the room
      client.to(boardId).emit('shape:add', { shape, type });

      // Track this shape ID to avoid duplicates
      this.trackShapeId(shape);

      // Only update database if the user is the board owner
      if (isOwner || this.boardOwners.get(boardId) === userId) {
        // We would update the board in DB if we wanted to persist individual shapes
        // But for now, we rely on the full board:update for persistence
      }
    } catch (error) {
      console.error('Error handling shape add:', error);
      client.emit('error', { message: 'Error broadcasting shape' });
    }
  }

  // Private helper to track recent shape IDs to avoid duplicates
  private recentShapeIds: Set<string> = new Set();

  private trackShapeId(shape: Record<string, unknown>) {
    if (shape.id && typeof shape.id === 'string') {
      this.recentShapeIds.add(shape.id);

      // Remove after 10 seconds to avoid memory leaks
      setTimeout(() => {
        this.recentShapeIds.delete(shape.id as string);
      }, 10000);
    }
  }

  private isShapeDuplicate(shape: Record<string, unknown>): boolean {
    if (shape.id && typeof shape.id === 'string') {
      return this.recentShapeIds.has(shape.id);
    }
    return false;
  }

  // Handle shape modify event
  @SubscribeMessage('shape:modify')
  handleShapeModify(
    client: Socket,
    @MessageBody()
    data: {
      boardId: string;
      objectId: string;
      props: Record<string, unknown>;
      userId: string;
      isOwner?: boolean;
    },
  ) {
    const { boardId, objectId, props, userId } = data;

    if (!boardId || !objectId || !props) return;

    // Broadcast modification to all other clients in the room
    client.to(boardId).emit('shape:modify', { objectId, props, userId });
  }

  // Handle shape delete event
  @SubscribeMessage('shape:delete')
  handleShapeDelete(
    client: Socket,
    @MessageBody()
    data: {
      boardId: string;
      objectId: string;
      userId: string;
      isOwner?: boolean;
    },
  ) {
    const { boardId, objectId, userId } = data;

    if (!boardId || !objectId) return;

    // Broadcast deletion to all other clients in the room
    client.to(boardId).emit('shape:delete', { objectId, userId });
  }

  // Handle user cursor movement
  @SubscribeMessage('cursor:move')
  handleCursorMove(
    client: Socket,
    @MessageBody()
    data: {
      boardId: string;
      userId: string;
      username: string;
      x: number;
      y: number;
      color: string;
    },
  ) {
    const { boardId } = data;

    if (!boardId) return;

    // Using volatile ensures unreliable, low-latency delivery - perfect for cursor updates
    // This will drop packets if the client is not ready to receive, preventing queue buildup

    client.to(boardId).volatile.emit('cursor:move', data);
    // client.to(boardId).emit('cursor:move', data);
  }

  // Get all active users in a board
  // @SubscribeMessage('board:get-users')
  // handleGetUsers(client: Socket, @MessageBody() data: { boardId: string }) {
  //   const { boardId } = data;

  //   if (!boardId) {
  //     client.emit('error', { message: 'Invalid boardId' });
  //     return;
  //   }

  //   try {
  //     // Create a list of active users for this board
  //     const usersList: Array<{ userId: string; username: string }> = [];

  //     for (const [, userData] of this.socketToUser.entries()) {
  //       if (userData.boardId === boardId) {
  //         usersList.push({
  //           userId: userData.userId,
  //           username: userData.username || 'Anonymous',
  //         });
  //       }
  //     }

  //     // Send the list back to the requester
  //     // client.emit('board:user-list', { users: usersList });
  //     console.log(
  //       `Sent user list for board ${boardId}: ${usersList.length} users`,
  //     );
  //   } catch (error) {
  //     console.error('Error getting users:', error);
  //     client.emit('error', { message: 'Error getting board users' });
  //   }
  // }
}
