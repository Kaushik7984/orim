import { useEffect } from "react";
import { User } from "firebase/auth"; // Import User type from Firebase Auth
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

    // Establish socket connection with authentication
    const connectWithToken = async () => {
      try {
        const token = await user.getIdToken();
        socket.auth = { token };
        socket.connect();
        // console.log(`Socket connected for user ${user.uid}`);
        console.log(`Socket connected for user ${user.displayName}`);
      } catch (err) {
        console.error("Socket connection failed:", err);
      }
    };

    console.log("Socket connected:", socket.connected);

    if (!socket.connected) {
      connectWithToken();
    }

    // Handle reconnecting to the board after page reload
    socket.on("disconnect", () => {
      console.warn("Socket disconnected. Reconnecting...");
      connectWithToken();
    });

    socket.on("reconnect", () => {
      console.info("Socket reconnected");
    });

    // Emit 'join-board' to sync the board state when the user joins
    socket.emit("board:join", { boardId, userId: user?.uid });
    console.log(`User ${user?.displayName} joined board ${boardId}`);

    return () => {
      // Emit 'leave-board' and disconnect when cleanup occurs
      socket.emit("board:leave", { boardId, userId: user?.uid });
      socket.disconnect();
      console.log(`User ${user?.displayName} left board ${boardId}`);
      console.log("Socket connected after:", socket.connected);
    };
  }, [user, boardId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !editor) return;

    // Handle board updates received from other users
    const handleBoardUpdate = (data: { canvasData: any; userId: string }) => {
      if (!data?.canvasData) return;
      console.log(`Received board update from user ${data.userId}`);

      editor.canvas.loadFromJSON(data.canvasData, () => {
        editor.canvas.renderAll();
        console.log("Canvas updated with new data");
      });
    };

    // Handle board sync updates
    const handleSync = (canvasData: any) => {
      if (!canvasData) return;
      console.log("Received board sync data");

      editor.canvas.loadFromJSON(canvasData, () => {
        editor.canvas.renderAll();
        console.log("Canvas synced with data");
      });
    };

    // Handle user joining the board
    const handleUserJoined = ({ userId }: { userId: string }) => {
      console.log(`User ${user?.displayName} joined the board`);
      setNewJoin(userId); // Update the UI with the new user
    };

    // Listen to real-time updates from the socket server
    socket.on("board:update", handleBoardUpdate);
    socket.on("board:sync", handleSync);
    socket.on("board:user-joined", handleUserJoined);

    return () => {
      // Cleanup event listeners on component unmount
      socket.off("board:update", handleBoardUpdate);
      socket.off("board:sync", handleSync);
      socket.off("board:user-joined", handleUserJoined);
      console.log("Cleaned up event listeners");
    };
  }, [editor, setNewJoin]);
};
