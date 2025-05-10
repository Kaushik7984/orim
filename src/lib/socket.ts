import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;
let socket: Socket | null = null;

export const SocketService = {
  _boardUpdateTimeout: null as NodeJS.Timeout | null,

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

  joinBoard(
    boardId: string,
    userId: string,
    username: string,
    isOwner: boolean = false
  ) {
    const socket = this.getSocket();
    if (!socket) return;

    socket.emit("board:join", { boardId, userId, username, isOwner });
    // socket.emit("board:get-users", { boardId });
  },

  leaveBoard(boardId: string, userId: string) {
    const socket = this.getSocket();
    if (!socket) return;

    socket.emit("board:leave", { boardId, userId });
  },

  // emit emitShapeAdd used in useshape and usePen instead of here

  //shape:modify emit
  emitShapeModify(
    boardId: string,
    objectId: string,
    props: any,
    userId: string,
    isOwner: boolean = false
  ) {
    const socket = this.getSocket();
    if (!socket) return;

    if (props && props.data && props.data.isCursor) return;

    socket.emit("shape:modify", { boardId, objectId, props, userId, isOwner });
  },

  //shape:delete emit
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

  //cursor:move emit
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

    socket.volatile.emit("cursor:move", {
      // socket.emit("cursor:move", {
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

export const getSocket = () => SocketService.getSocket();
