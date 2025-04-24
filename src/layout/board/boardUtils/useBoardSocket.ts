import { useEffect } from "react";
import { fabric } from "fabric";
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

    connectSocket();
    socketJoinBoard(initialBoardId);

    const handleDrawBroadcast = (content: any) => {
      const { path, canvasData } = content;
      const newPath = new fabric.Path(path.path);
      newPath.set({ ...path });
      editor.canvas.add(newPath);
      editor.canvas.loadFromJSON(canvasData, () => {
        editor.canvas.renderAll();
      });
    };

    onBoardUpdate(handleDrawBroadcast);

    const handleLocalDraw = (e: any) => {
      const canvasData = editor.canvas.toJSON();
      emitBoardUpdate(initialBoardId, { path: e.path, canvasData });
    };

    editor.canvas.on("path:created", handleLocalDraw);

    return () => {
      editor.canvas.off("path:created", handleLocalDraw);
      offBoardUpdate();
      disconnectSocket();
    };
  }, [editor, initialBoardId]);
}
