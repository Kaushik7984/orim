import { useEffect } from "react";
import {
  connectSocket,
  disconnectSocket,
  emitBoardUpdate,
  joinBoard as socketJoinBoard,
  onBoardUpdate,
  offBoardUpdate,
} from "@/lib/socket";

export default function useBoardSocket(editor: any, initialBoardId: string) {
  useEffect(() => {
    if (!editor || !initialBoardId) return;

    // Connect socket and join the board room
    connectSocket();
    socketJoinBoard(initialBoardId);

    // Handle drawing updates received from other users
    const handleDrawBroadcast = (content: any) => {
      const { canvasData } = content;
      if (!canvasData) return;

      editor.canvas.loadFromJSON(canvasData, () => {
        editor.canvas.renderAll();
      });
    };

    onBoardUpdate(handleDrawBroadcast);

    // Emit drawing updates when the local user draws
    const handleLocalDraw = () => {
      const canvasData = editor.canvas.toJSON();
      emitBoardUpdate(initialBoardId, null, canvasData);
    };

    editor.canvas.on("path:created", handleLocalDraw);

    return () => {
      // Cleanup on unmount
      editor.canvas.off("path:created", handleLocalDraw);
      offBoardUpdate();
      disconnectSocket();
    };
  }, [editor, initialBoardId]);
}
