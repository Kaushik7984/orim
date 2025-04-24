import { useEffect, useRef } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { boardAPI } from "@/lib/boardApi";

export const useBoardAutoSave = (editor?: FabricJSEditor, boardId?: string) => {
  const lastCanvasDataRef = useRef<string>("");

  useEffect(() => {
    if (!editor || !boardId) return;

    const saveCanvas = async () => {
      try {
        const canvasJSON = editor.canvas.toJSON();
        const currentCanvasData = JSON.stringify(canvasJSON);

        if (currentCanvasData !== lastCanvasDataRef.current) {
          lastCanvasDataRef.current = currentCanvasData;

          await boardAPI.updateBoard(boardId, {
            canvasData: JSON.parse(currentCanvasData),
          });

          // console.log("Canvas auto-saved.");
        }
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    };

    const interval = setInterval(saveCanvas, 500);

    return () => {
      clearInterval(interval);
    };
  }, [editor, boardId]);
};
