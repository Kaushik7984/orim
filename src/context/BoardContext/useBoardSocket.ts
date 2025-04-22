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
    let socket = getSocket();

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

    socket.on("board-update", handleBoardUpdate);
    socket.on("user-joined", handleUserJoined);

    return () => {
      socket.off("board-update", handleBoardUpdate);
      socket.off("user-joined", handleUserJoined);
    };
  }, [setCurrentBoard, setNewJoin]);
};
