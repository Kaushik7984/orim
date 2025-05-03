import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";
let socket: Socket | null = null;

// Initialize socket on client-side with token from localStorage
export const getSocket = () => {
  if (!socket && typeof window !== "undefined") {
    const token = localStorage.getItem("token") || "";

    if (!token) {
      console.error("Socket connection error: No token found");
      return null;
    }

    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    // Development-only logs
    if (process.env.NODE_ENV === "development") {
      socket.on("connect", () => console.log("Connected to socket"));
      socket.on("disconnect", () => console.log("Disconnected from socket"));
    }
  }

  return socket;
};

// Manually connect the socket if not already connected
export const connectSocket = () => {
  const socket = getSocket();
  if (socket && !socket.connected) {
    socket.connect();
  }
};

// Manually disconnect the socket
export const disconnectSocket = () => {
  const socket = getSocket();
  if (socket?.connected) socket.disconnect();
};

// Join a board room by ID
export const joinBoard = (boardId: string) => {
  const socket = getSocket();
  if (socket) {
    socket.emit("board:join", boardId);
  } else {
    console.error("Socket not connected, unable to join the board");
  }
};

// Emit a board update event
export const emitBoardUpdate = (
  boardId: string,
  path: any,
  canvasData: any
) => {
  const socket = getSocket();
  if (socket) {
    socket.emit("board:update", { boardId, path, canvasData });
  } else {
    console.error("Socket not connected, unable to emit board update");
  }
};

// Subscribe to board updates
export const onBoardUpdate = (callback: (content: any) => void) => {
  const socket = getSocket();
  if (socket) {
    socket.on("board:update", callback);

    // Cleanup function
    return () => {
      socket.off("board:update", callback);
    };
  }
};

// Unsubscribe from board updates
export const offBoardUpdate = () => {
  const socket = getSocket();
  if (socket) {
    socket.off("board:update");
  }
};
