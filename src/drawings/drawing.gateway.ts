  private userRooms: Map<string, Set<string>> = new Map();
  private roomUsers: Map<string, Set<string>> = new Map();

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

  handleJoin(client: Socket, drawingId: string) {
    const userId = client.data.userId;
    this.ensureUserRooms(userId).add(drawingId);
    this.ensureRoomUsers(drawingId).add(userId);
    client.join(drawingId);
  }

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