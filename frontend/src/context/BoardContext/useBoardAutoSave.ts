import { useEffect, useRef, useState } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { boardAPI } from "@/lib/boardApi";
import { useAuth } from "../AuthContext";

export const useBoardAutoSave = (editor?: FabricJSEditor, boardId?: string) => {
  const lastCanvasDataRef = useRef<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if current user is the board owner
  useEffect(() => {
    if (!user || !boardId) {
      setIsLoading(false);
      return;
    }

    const checkOwnership = async () => {
      try {
        setIsLoading(true);
        const board = await boardAPI.getBoard(boardId);
        setIsOwner(board.ownerId === user.uid);
      } catch (error) {
        // If board doesn't exist, set current user as owner
        setIsOwner(true);
        console.log("New board, setting current user as owner");
      } finally {
        setIsLoading(false);
      }
    };

    checkOwnership();
  }, [boardId, user]);

  useEffect(() => {
    if (!editor || !boardId) return;

    const saveCanvas = async () => {
      if (isSaving) return;

      try {
        setIsSaving(true);
        const canvasJSON = editor.canvas.toJSON([
          "id",
          "globalCompositeOperation",
        ]);
        const currentCanvasData = JSON.stringify(canvasJSON);

        if (currentCanvasData !== lastCanvasDataRef.current) {
          lastCanvasDataRef.current = currentCanvasData;

          if (isOwner) {
            await boardAPI.updateBoard(boardId, {
              canvasData: JSON.parse(currentCanvasData),
            });
            setLastSaveTime(new Date());
            console.log("Canvas saved to database (owner)");
          }
        }
      } catch (err) {
        console.error("Auto-save failed:", err);
      } finally {
        setIsSaving(false);
      }
    };

    const debounceSave = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(saveCanvas, 500);
    };

    const handleCanvasChange = () => {
      debounceSave();
    };

    // Listen for canvas changes
    const canvasEvents = [
      "object:modified",
      "object:added",
      "object:removed",
      "path:created",
      "object:rotating",
      "object:scaling",
      "object:moving",
      "text:changed",
      "selection:created",
      "selection:updated",
      "selection:cleared",
    ];

    canvasEvents.forEach((event) => {
      editor.canvas.on(event, handleCanvasChange);
    });

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      canvasEvents.forEach((event) => {
        editor.canvas.off(event, handleCanvasChange);
      });
    };
  }, [editor, boardId, user, isOwner, isSaving]);

  return {
    isSaving,
    lastSaveTime,
    isOwner,
    isLoading,
  };
};
