import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DrawingEvent, JoinDrawingRoom, LeaveDrawingRoom } from './interfaces/drawing-events.interface';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, replace with your frontend URL
  },
})
@UseGuards(JwtAuthGuard)
export class DrawingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userRooms: Map<string, Set<string>> = new Map(); // userId -> Set<drawingId>
  private roomUsers: Map<string, Set<string>> = new Map(); // drawingId -> Set<userId>

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Clean up room assignments when a client disconnects
    this.userRooms.forEach((rooms, userId) => {
      rooms.forEach(roomId => {
        this.handleLeaveRoom(client, { drawingId: roomId, userId });
      });
    });
  }

  @SubscribeMessage('joinDrawingRoom')
  handleJoinRoom(client: Socket, data: JoinDrawingRoom) {
    const { drawingId, userId } = data;
    
    // Add user to room
    client.join(drawingId);
    
    // Update room tracking
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, new Set());
    }
    this.userRooms.get(userId).add(drawingId);
    
    if (!this.roomUsers.has(drawingId)) {
      this.roomUsers.set(drawingId, new Set());
    }
    this.roomUsers.get(drawingId).add(userId);
    
    // Notify others in the room
    client.to(drawingId).emit('userJoined', { userId });
  }

  @SubscribeMessage('leaveDrawingRoom')
  handleLeaveRoom(client: Socket, data: LeaveDrawingRoom) {
    const { drawingId, userId } = data;
    
    // Remove user from room
    client.leave(drawingId);
    
    // Update room tracking
    if (this.userRooms.has(userId)) {
      this.userRooms.get(userId).delete(drawingId);
    }
    
    if (this.roomUsers.has(drawingId)) {
      this.roomUsers.get(drawingId).delete(userId);
    }
    
    // Notify others in the room
    client.to(drawingId).emit('userLeft', { userId });
  }

  @SubscribeMessage('drawingEvent')
  handleDrawingEvent(client: Socket, data: DrawingEvent & { drawingId: string }) {
    const { drawingId, ...event } = data;
    // Broadcast the drawing event to all clients in the room except the sender
    client.to(drawingId).emit('drawingEvent', event);
  }
} 