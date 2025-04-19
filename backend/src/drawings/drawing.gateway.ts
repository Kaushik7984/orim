// /* eslint-disable @typescript-eslint/no-floating-promises */
// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   MessageBody,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import {
//   DrawingEvent,
//   JoinDrawingRoom,
//   LeaveDrawingRoom,
// } from './interfaces/drawing-events.interface';
// import { DrawingsService } from './drawings.service';
// import { UsersService } from '../users/users.service';

// interface DrawData {
//   drawingId: string;
//   path: {
//     id: string;
//     type: string;
//     x: number;
//     y: number;
//     width?: number;
//     height?: number;
//     points?: Array<{ x: number; y: number }>;
//     strokeColor?: string;
//     fillColor?: string;
//     strokeWidth?: number;
//     text?: string;
//     fontSize?: number;
//     fontFamily?: string;
//   };
//   socketId: string;
// }

// @WebSocketGateway({
//   cors: {
//     origin: '*', // In production, replace with your frontend URL
//   },
// })
// @UseGuards(JwtAuthGuard)
// export class DrawingGateway
//   implements OnGatewayConnection, OnGatewayDisconnect
// {
//   @WebSocketServer()
//   server: Server;

//   private userRooms: Map<string, Set<string>> = new Map(); // userId -> Set<drawingId>
//   private roomUsers: Map<string, Set<string>> = new Map(); // drawingId -> Set<userId>

//   constructor(
//     private drawingsService: DrawingsService,
//     private usersService: UsersService,
//   ) {}

//   private ensureUserRooms(userId: string): Set<string> {
//     if (!this.userRooms.has(userId)) {
//       this.userRooms.set(userId, new Set());
//     }
//     return this.userRooms.get(userId)!;
//   }

//   private ensureRoomUsers(drawingId: string): Set<string> {
//     if (!this.roomUsers.has(drawingId)) {
//       this.roomUsers.set(drawingId, new Set());
//     }
//     return this.roomUsers.get(drawingId)!;
//   }

//   handleConnection(client: Socket) {
//     console.log(`Client connected: ${client.id}`);
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`Client disconnected: ${client.id}`);
//     // Clean up room assignments when a client disconnects
//     this.userRooms.forEach((rooms, userId) => {
//       rooms.forEach((roomId) => {
//         this.handleLeaveRoom(client, { drawingId: roomId, userId });
//       });
//     });
//   }

//   @SubscribeMessage('joinDrawingRoom')
//   handleJoinRoom(client: Socket, data: JoinDrawingRoom) {
//     const { drawingId, userId } = data;

//     // Add user to room
//     client.join(drawingId);

//     // Update room tracking
//     this.ensureUserRooms(userId).add(drawingId);
//     this.ensureRoomUsers(drawingId).add(userId);

//     // Notify others in the room
//     client.to(drawingId).emit('userJoined', { userId });
//   }

//   @SubscribeMessage('leaveDrawingRoom')
//   handleLeaveRoom(client: Socket, data: LeaveDrawingRoom) {
//     const { drawingId, userId } = data;

//     // Remove user from room
//     client.leave(drawingId);

//     // Update room tracking
//     const userRooms = this.userRooms.get(userId);
//     const roomUsers = this.roomUsers.get(drawingId);

//     if (userRooms) {
//       userRooms.delete(drawingId);
//     }

//     if (roomUsers) {
//       roomUsers.delete(userId);
//     }

//     // Notify others in the room
//     client.to(drawingId).emit('userLeft', { userId });
//   }

//   @SubscribeMessage('drawingEvent')
//   handleDrawingEvent(
//     client: Socket,
//     data: DrawingEvent & { drawingId: string },
//   ) {
//     const { drawingId, ...event } = data;
//     // Broadcast the drawing event to all clients in the room except the sender
//     client.to(drawingId).emit('drawingEvent', event);
//   }

//   @SubscribeMessage('draw')
//   async handleDraw(@MessageBody() data: DrawData) {
//     const { drawingId, path, socketId } = data;
//     // Get the user from the socket
//     const userId = this.getUserIdFromSocket(
//       this.server.sockets.sockets.get(socketId),
//     );
//     if (!userId) {
//       return;
//     }

//     // Find the user document
//     const user = await this.usersService.findOne(userId);

//     // Update the drawing with the user parameter
//     await this.drawingsService.updateContent(
//       drawingId,
//       {
//         elements: [path],
//         viewport: {
//           x: 0,
//           y: 0,
//           width: 800,
//           height: 600,
//           zoom: 1,
//         },
//       },
//       user,
//     );
//     this.server.to(drawingId).emit('draw', path);
//   }

//   private getUserIdFromSocket(socket: Socket | undefined): string | undefined {
//     if (socket) {
//       const userId = socket.handshake.auth.userId as string;
//       if (userId) {
//         return userId;
//       }
//     }
//     return undefined;
//   }
// }

// src/drawings/drawing.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DrawingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-board')
  handleJoinBoard(client: Socket, boardId: string) {
    client.join(boardId);
    console.log(`Client ${client.id} joined board ${boardId}`);
  }

  @SubscribeMessage('board:update')
  handleBoardUpdate(client: Socket, { boardId, content }) {
    client.to(boardId).emit('board:update', content);
  }
}
