import { useEffect } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { boardAPI } from "@/utils/boardApi";

export const useBoardAutoSave = (editor?: FabricJSEditor, boardId?: string) => {
  useEffect(() => {
    if (!editor || !boardId) return;

    let lastCanvasData = "";

    const interval = setInterval(async () => {
      try {
        const canvasJSON = editor.canvas.toJSON();
        const currentCanvasData = JSON.stringify(canvasJSON);

        if (currentCanvasData !== lastCanvasData) {
          lastCanvasData = currentCanvasData;

          await boardAPI.updateBoard(boardId, {
            canvasData: currentCanvasData,
          });

          console.log("Canvas auto-saved", canvasJSON);
        }
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [editor, boardId]);
};
