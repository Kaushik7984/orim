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
    const setup = async () => {
      if (user) {
        const token = await user.getIdToken();
        const socket = getSocket();

        if (socket) {
          socket.auth = { token };
          socket.connect();
        }
      }
    };

    setup();

    return () => {
      const socket = getSocket();
      if (socket) socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    const handleUpdate = (updatedBoard: Board) => setCurrentBoard(updatedBoard);
    const handleJoin = ({ username }: { username: string }) =>
      setNewJoin(username);

    socket.on("board-update", handleUpdate);
    socket.on("user-joined", handleJoin);

    return () => {
      socket.off("board-update", handleUpdate);
      socket.off("user-joined", handleJoin);
    };
  }, []);
};
