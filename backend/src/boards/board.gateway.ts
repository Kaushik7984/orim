import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { BoardsService } from "./boards.service";
import { ConnectedSocket } from "@nestjs/websockets";
@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
})
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Maps to track users and sockets associated with board sessions
  private boardUsers: Map<string, Set<string>> = new Map();
  private socketToUser: Map<
    string,
    { boardId: string; userId: string; username: string }
  > = new Map();
  private boardOwners: Map<string, string> = new Map();

  constructor(private readonly boardsService: BoardsService) {}

  // Handle client connection and register socket events
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    // Remove duplicate event handlers since they're handled by @SubscribeMessage decorators
    client.on("cursor:move", (data) => this.handleCursorMove(client, data)); // for cursor move
    client.on("shape:add", (data) => this.handleShapeAdd(client, data)); // live sync(add shapes on board)
    client.on("shape:modify", (data) => this.handleShapeModify(client, data)); //live sync (change position of shape)
    client.on("shape:delete", (data) => this.handleShapeDelete(client, data)); //live sync (delete shape)
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
      client.to(boardId).emit("board:user-left", { userId });
      this.socketToUser.delete(client.id);
    }
  }

  // Handle user joining a board
  @SubscribeMessage("board:join")
  async handleJoinBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      boardId: string;
      userId: string;
      username: string;
      isOwner?: boolean;
    }
  ) {
    const { boardId, userId, username, isOwner } = data;

    if (!boardId || !userId) {
      client.emit("error", { message: "Invalid boardId or userId" });
      return;
    }

    try {
      // Check if user is already in the board
      const users = this.boardUsers.get(boardId);
      if (users?.has(userId)) {
        console.log(
          `User ${username || userId} is already in board ${boardId}`
        );
        return;
      }

      await client.join(boardId);

      if (!this.boardUsers.has(boardId)) {
        this.boardUsers.set(boardId, new Set());
      }

      this.boardUsers.get(boardId)?.add(userId);
      this.socketToUser.set(client.id, {
        boardId,
        userId,
        username: username || "Anonymous",
      });

      // Notify others in the board room
      client.to(boardId).emit("board:user-joined", {
        userId,
        username: username || "Anonymous",
        isOwner,
      });

      // Send current board state to the joining user
      const board = await this.boardsService.findBoardById(boardId);
      if (board?.canvasData) {
        client.emit("board:sync", board.canvasData);
      }

      console.log(`User ${username || userId} joined board ${boardId}`);
    } catch (error) {
      console.error("Error joining board:", error);
      client.emit("error", { message: "Error joining the board" });
    }
  }

  // Handle user leaving a board
  @SubscribeMessage("board:leave")
  async handleLeaveBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardId: string; userId: string }
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
      client.to(boardId).emit("board:user-left", { userId });
      console.log(`User ${userId} left board ${boardId}`);

      // Need at least one await to satisfy linter
      await Promise.resolve();
    } catch (error) {
      console.error("Error leaving board:", error);
      client.emit("error", { message: "Error leaving the board" });
    }
  }

  // Handle shape add event
  @SubscribeMessage("shape:add")
  handleShapeAdd(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      boardId: string;
      shape: Record<string, unknown>;
      type: string;
      userId: string;
      isOwner: boolean;
    }
  ) {
    const { boardId, shape, type, userId, isOwner } = data;

    if (!boardId || !shape) {
      client.emit("error", { message: "Invalid boardId or shape data" });
      return;
    }

    try {
      // De-duplicate before broadcasting
      if (this.isShapeDuplicate(shape)) {
        console.log(
          `Duplicate shape detected: ${String(shape.id)}, skipping broadcast`
        );
        return;
      }

      client.to(boardId).emit("shape:add", { shape, type });

      // Track this shape ID to avoid duplicates
      this.trackShapeId(shape);

      // Only update database if the user is the board owner
      if (isOwner || this.boardOwners.get(boardId) === userId) {
        // We would update the board in DB if we wanted to persist individual shapes
        // But for now, we rely on the full board:update for persistence
      }
    } catch (error) {
      console.error("Error handling shape add:", error);
      client.emit("error", { message: "Error broadcasting shape" });
    }
  }

  // Private helper to track recent shape IDs to avoid duplicates
  private recentShapeIds: Set<string> = new Set();

  private trackShapeId(shape: Record<string, unknown>) {
    if (shape.id && typeof shape.id === "string") {
      this.recentShapeIds.add(shape.id);

      setTimeout(() => {
        this.recentShapeIds.delete(shape.id as string);
      }, 10000);
    }
  }

  private isShapeDuplicate(shape: Record<string, unknown>): boolean {
    if (shape.id && typeof shape.id === "string") {
      return this.recentShapeIds.has(shape.id);
    }
    return false;
  }

  // Handle shape modify event
  @SubscribeMessage("shape:modify")
  handleShapeModify(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      boardId: string;
      objectId: string;
      props: Record<string, unknown>;
      userId: string;
      isOwner?: boolean;
    }
  ) {
    const { boardId, objectId, props, userId } = data;

    if (!boardId || !objectId || !props) return;

    // Broadcast modification to all other clients in the room
    client.to(boardId).emit("shape:modify", { objectId, props, userId });
  }

  // Handle shape delete event
  @SubscribeMessage("shape:delete")
  handleShapeDelete(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      boardId: string;
      objectId: string;
      userId: string;
      isOwner?: boolean;
    }
  ) {
    const { boardId, objectId, userId } = data;

    if (!boardId || !objectId) return;

    // Broadcast deletion to all other clients in the room
    client.to(boardId).emit("shape:delete", { objectId, userId });
  }

  // Handle user cursor movement
  @SubscribeMessage("cursor:move")
  handleCursorMove(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      boardId: string;
      userId: string;
      username: string;
      x: number;
      y: number;
      color: string;
    }
  ) {
    const { boardId } = data;

    if (!boardId) return;

    client.to(boardId).volatile.emit("cursor:move", data);
  }
}
