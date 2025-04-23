import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { Board } from "@/types";
import { User } from "firebase/auth";

export const useBoardSocket = (
  user: User | null,
  setCurrentBoard: (board: Board) => void,
  setNewJoin: (username: string) => void
) => {
  useEffect(() => {
    const socket = getSocket();

    const setupSocket = async () => {
      if (user && socket && !socket.connected) {
        try {
          const token = await user.getIdToken();
          socket.auth = { token };
          socket.connect();
        } catch (err) {
          console.error("Failed to connect socket:", err);
        }
      }
    };

    setupSocket();

    // Handle socket disconnection and attempt reconnection
    socket?.on("disconnect", () => {
      console.log("Socket disconnected. Attempting to reconnect...");
      setupSocket();
    });

    socket?.on("reconnect", () => {
      console.log("Socket reconnected.");
    });

    return () => {
      if (socket?.connected) {
        socket.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleBoardUpdate = (updatedBoard: Board) => {
      setCurrentBoard(updatedBoard);
    };

    const handleUserJoined = ({ username }: { username: string }) => {
      setNewJoin(username);
    };

    // Emit board updates (for example, when a user draws or moves an object)
    const emitBoardUpdate = (updatedBoardData: Board) => {
      socket.emit("board-update", updatedBoardData);
    };

    socket.on("board-update", handleBoardUpdate);
    socket.on("user-joined", handleUserJoined);

    // Example of emitting an update when something changes on the board
    // You would call emitBoardUpdate whenever board data changes (e.g., when drawing a shape, adding text, etc.)
    // emitBoardUpdate(updatedBoard);

    return () => {
      socket.off("board-update", handleBoardUpdate);
      socket.off("user-joined", handleUserJoined);
    };
  }, [setCurrentBoard, setNewJoin]);
};
