import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";
let socket: Socket | null = null;

// Initialize socket only on client-side and handle token retrieval
export const getSocket = () => {
  if (!socket && typeof window !== "undefined") {
    const token = localStorage.getItem("token") || ""; // Retrieve the token from localStorage

    if (!token) {
      console.error("Socket connection error: No token found");
      return null;
    }

    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: { token }, // Pass the token to the socket connection
    });

    // Optional debug logs
    if (process.env.NODE_ENV === "development") {
      socket.on("connect", () => console.log("✅ Connected to socket"));
      socket.on("disconnect", () => console.log("❌ Disconnected from socket"));
      socket.on("connect_error", (err) =>
        console.error("Socket connection error:", err)
      );
    }
  }

  return socket;
};

// Connect the socket if it's not already connected
export const connectSocket = () => {
  const socket = getSocket();
  if (socket && !socket.connected) {
    socket.connect();
  }
};

// Disconnect the socket if connected
export const disconnectSocket = () => {
  const socket = getSocket();
  if (socket?.connected) socket.disconnect();
};

// Join a specific board by emitting a join event
export const joinBoard = (boardId: string) => {
  const socket = getSocket();
  if (socket) {
    socket.emit("join-board", boardId);
  } else {
    console.error("Socket not connected, unable to join the board");
  }
};

// Emit board update event with content
export const emitBoardUpdate = (boardId: string, content: any) => {
  const socket = getSocket();
  if (socket) {
    socket.emit("board:update", { boardId, content });
  } else {
    console.error("Socket not connected, unable to emit board update");
  }
};

// Subscribe to board updates and handle the updates via callback
export const onBoardUpdate = (callback: (content: any) => void) => {
  const socket = getSocket();
  if (socket) {
    socket.on("board:update", callback);
  }
};

// Unsubscribe from board updates
export const offBoardUpdate = () => {
  const socket = getSocket();
  if (socket) {
    socket.off("board:update");
  }
};
