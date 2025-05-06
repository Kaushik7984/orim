import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  // process.env.NEXT_PUBLIC_SOCKET_URL ||
  // "http://localhost:3001" ||
  "http://192.168.200.39:3001";
let socket: Socket | null = null;

/**
 * Socket singleton that manages the connection and provides event helpers
 */
export const SocketService = {
  // State properties
  _boardUpdateTimeout: null as NodeJS.Timeout | null,

  // Core connection methods
  connect() {
    if (socket) return socket;

    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("token") || "";
    if (!token) {
      console.error("Socket connection error: No token found");
      return null;
    }

    socket = io(SOCKET_URL, {
      autoConnect: true,
      auth: { token },
      transports: ["websocket"],
    });

    // Setup default handlers
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    if (process.env.NODE_ENV === "development") {
      socket.on("connect", () => console.log("Socket connected"));
      socket.on("disconnect", () => console.log("Socket disconnected"));
    }

    return socket;
  },

  disconnect() {
    if (socket?.connected) socket.disconnect();
  },

  getSocket() {
    return socket || this.connect();
  },

  // Board room methods
  joinBoard(
    boardId: string,
    userId: string,
    username: string,
    isOwner: boolean = false
  ) {
    const socket = this.getSocket();
    if (!socket) return;

    socket.emit("board:join", { boardId, userId, username, isOwner });
    socket.emit("board:get-users", { boardId });
  },

  leaveBoard(boardId: string, userId: string) {
    const socket = this.getSocket();
    if (!socket) return;

    socket.emit("board:leave", { boardId, userId });
  },

  // Utility to remove duplicate shapes from outgoing canvasData
  cleanCanvasDataForSync(canvasData: any): any {
    if (!canvasData || !canvasData.objects) return canvasData;

    // Filter out cursor objects
    const objects = canvasData.objects.filter(
      (obj: any) => !obj.data || !obj.data.isCursor
    );

    // Create a map to track objects by ID to remove duplicates
    const uniqueObjects = new Map();

    // Keep only the last instance of each object ID
    objects.forEach((obj: any) => {
      if (obj.id) {
        uniqueObjects.set(obj.id, obj);
      }
    });

    // Convert back to array
    const cleanedObjects = Array.from(uniqueObjects.values());

    // Return cleaned canvas data
    return {
      ...canvasData,
      objects: cleanedObjects,
    };
  },

  // Canvas/drawing event methods
  emitBoardUpdate(
    boardId: string,
    userId: string,
    canvasData: any,
    isOwner: boolean = false
  ) {
    const socket = this.getSocket();
    if (!socket) return;

    // Prevent flooding with rapid updates
    if (this._boardUpdateTimeout) {
      clearTimeout(this._boardUpdateTimeout);
    }

    // Delay update emission to prevent overwriting local changes
    this._boardUpdateTimeout = setTimeout(() => {
      // Clean up canvas data before sending
      const cleanedCanvasData = this.cleanCanvasDataForSync(canvasData);
      socket.emit("board:update", {
        boardId,
        canvasData: cleanedCanvasData,
        userId,
        isOwner,
      });

      this._boardUpdateTimeout = null;
    }, 500);
  },

  emitShapeAdd(
    boardId: string,
    shape: any,
    type: string,
    userId: string,
    isOwner: boolean = false
  ) {
    const socket = this.getSocket();
    if (!socket) return;

    // Don't emit cursor objects
    if (shape && shape.data && shape.data.isCursor) return;

    socket.emit("shape:add", { boardId, shape, type, userId, isOwner });
  },

  emitShapeModify(
    boardId: string,
    objectId: string,
    props: any,
    userId: string,
    isOwner: boolean = false
  ) {
    const socket = this.getSocket();
    if (!socket) return;

    // Don't emit cursor modifications
    if (props && props.data && props.data.isCursor) return;

    socket.emit("shape:modify", { boardId, objectId, props, userId, isOwner });
  },

  emitShapeDelete(
    boardId: string,
    objectId: string,
    userId: string,
    isOwner: boolean = false
  ) {
    const socket = this.getSocket();
    if (!socket) return;

    socket.emit("shape:delete", { boardId, objectId, userId, isOwner });
  },

  // Optimized for frequent updates, minimal data transfer
  emitCursorMove(
    boardId: string,
    userId: string,
    username: string,
    x: number,
    y: number,
    color: string
  ) {
    const socket = this.getSocket();
    if (!socket) return;

    // Send minimal cursor data, not persisted in DB
    socket.volatile.emit("cursor:move", {
      boardId,
      userId,
      username,
      x,
      y,
      color,
    });
  },

  // Event subscription helpers
  on(event: string, callback: Function) {
    const socket = this.getSocket();
    if (!socket) return () => {};

    socket.on(event, callback as any);
    return () => socket.off(event, callback as any);
  },

  off(event: string, callback?: Function) {
    const socket = this.getSocket();
    if (!socket) return;

    if (callback) {
      socket.off(event, callback as any);
    } else {
      socket.off(event);
    }
  },
};

// Export a simplified function for backward compatibility
export const getSocket = () => SocketService.getSocket();
