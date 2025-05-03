import { useEffect } from "react";
import { User } from "firebase/auth";
import { getSocket } from "@/lib/socket";
import { FabricJSEditor } from "fabricjs-react";

export const useBoardSocket = (
  user: User | null,
  boardId: string | undefined,
  editor: FabricJSEditor | undefined,
  setNewJoin: (username: string) => void
) => {
  useEffect(() => {
    const socket = getSocket();
    if (!user || !socket || !boardId) return;

    // Authenticate and connect socket
    const connectWithToken = async () => {
      try {
        const token = await user.getIdToken();
        socket.auth = { token };
        socket.connect();
      } catch (err) {
        console.error("Socket connection failed:", err);
      }
    };

    if (!socket.connected) {
      connectWithToken();
    }

    // Reconnect on disconnect
    socket.on("disconnect", connectWithToken);

    // Join the board room
    socket.emit("board:join", { boardId, userId: user.uid });

    return () => {
      // Leave the board room and disconnect on cleanup
      socket.emit("board:leave", { boardId, userId: user.uid });
      socket.disconnect();
    };
  }, [user, boardId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !editor) return;

    // Update canvas when another user makes changes
    const handleBoardUpdate = ({ canvasData }: { canvasData: any }) => {
      if (!canvasData) return;
      editor.canvas.loadFromJSON(canvasData, () => editor.canvas.renderAll());
    };

    // Sync entire canvas state
    const handleSync = (canvasData: any) => {
      if (!canvasData) return;
      editor.canvas.loadFromJSON(canvasData, () => editor.canvas.renderAll());
    };

    // Notify when a new user joins
    const handleUserJoined = ({ userId }: { userId: string }) => {
      setNewJoin(userId);
    };

    socket.on("board:update", handleBoardUpdate);
    socket.on("board:sync", handleSync);
    socket.on("board:user-joined", handleUserJoined);

    return () => {
      socket.off("board:update", handleBoardUpdate);
      socket.off("board:sync", handleSync);
      socket.off("board:user-joined", handleUserJoined);
    };
  }, [editor, setNewJoin]);
};
