import { useEffect, useRef } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { boardAPI } from "@/lib/boardApi";

export const useBoardAutoSave = (editor?: FabricJSEditor, boardId?: string) => {
  const lastCanvasDataRef = useRef<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

          console.log("Canvas auto-saved.");
        }
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    };

    // Debounced auto-save: Save after 2 seconds of inactivity
    const debounceSave = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(saveCanvas, 2000); // Save after 2 seconds
    };

    // Listen to changes in the editor canvas
    editor.canvas.on("object:modified", debounceSave);
    editor.canvas.on("object:added", debounceSave);
    editor.canvas.on("object:removed", debounceSave);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      editor.canvas.off("object:modified", debounceSave);
      editor.canvas.off("object:added", debounceSave);
      editor.canvas.off("object:removed", debounceSave);
    };
  }, [editor, boardId]);
};
