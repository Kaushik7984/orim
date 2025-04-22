// src/lib/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

let socket: Socket | null = null;

// Initialize socket only on client-side
export const getSocket = () => {
  if (!socket && typeof window !== "undefined") {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token: localStorage.getItem("token") || "",
      },
    });

    // Optional debug logs
    socket.on("connect", () => console.log("✅ Connected to socket"));
    socket.on("disconnect", () => console.log("❌ Disconnected from socket"));
    socket.on("connect_error", (err) =>
      console.error("Socket connection error:", err)
    );
  }

  return socket;
};

export const connectSocket = () => {
  const socket = getSocket();
  if (socket && !socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  const socket = getSocket();
  if (socket?.connected) socket.disconnect();
};

export const joinBoard = (boardId: string) => {
  const socket = getSocket();
  socket?.emit("join-board", boardId);
};

export const emitBoardUpdate = (boardId: string, content: any) => {
  const socket = getSocket();
  socket?.emit("board:update", { boardId, content });
};

export const onBoardUpdate = (callback: (content: any) => void) => {
  const socket = getSocket();
  socket?.on("board:update", callback);
};

export const offBoardUpdate = () => {
  const socket = getSocket();
  socket?.off("board:update");
};
