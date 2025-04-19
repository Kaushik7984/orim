import { useEffect } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { boardAPI } from "@/utils/boardApi";

export const useBoardAutoSave = (editor?: FabricJSEditor, boardId?: string) => {
  useEffect(() => {
    if (!editor || !boardId) return;

    const interval = setInterval(async () => {
      try {
        const canvasData = editor.canvas.toJSON();
        await boardAPI.updateBoard(boardId, {
          imageUrl: JSON.stringify(canvasData),
        });
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [editor, boardId]);
};
