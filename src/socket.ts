import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem("token"),
  },
});

// Add socket event listeners
socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});
