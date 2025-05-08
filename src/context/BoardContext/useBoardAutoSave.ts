import { useEffect, useRef, useState } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { boardAPI } from "@/lib/boardApi";
import { SocketService } from "@/lib/socket";
import { useAuth } from "../AuthContext";

export const useBoardAutoSave = (
  editor?: FabricJSEditor,
  boardId?: string,
  isSessionMode: boolean = false
) => {
  const lastCanvasDataRef = useRef<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  // Check if current user is the board owner
  useEffect(() => {
    if (!user || !boardId || isSessionMode) {
      if (isSessionMode) {
        console.log("Ownership check skipped in session mode");
      }
      return;
    }

    const checkOwnership = async () => {
      try {
        const board = await boardAPI.getBoard(boardId);
        setIsOwner(board.ownerId === user.uid);
      } catch (error) {
        // If board doesn't exist, assume the current user will be the owner
        setIsOwner(true);
        console.log("New board detected, setting current user as owner");
      }
    };

    checkOwnership();
  }, [boardId, user, isSessionMode]);

  useEffect(() => {
    if (!editor?.canvas || !boardId || isSessionMode) {
      if (isSessionMode) {
        console.log("Autosave disabled in session mode");
      }
      return;
    }

    const debounce = <T extends (...args: any[]) => void>(
      callback: T,
      delay: number
    ) => {
      return (...args: Parameters<T>) => {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => callback(...args), delay);
      };
    };

    const saveCanvas = async () => {
      try {
        const canvasJSON = editor.canvas.toJSON([
          "id",
          "globalCompositeOperation",
        ]);
        const currentCanvasData = JSON.stringify(canvasJSON);

        if (currentCanvasData === lastCanvasDataRef.current) {
          return; // No changes to save
        }

        lastCanvasDataRef.current = currentCanvasData;

        // Save to database if the user is the owner
        if (isOwner) {
          await boardAPI.updateBoard(boardId, {
            canvasData: JSON.parse(currentCanvasData),
          });
          console.log("Canvas saved to database (owner)");
        }

        // Emit real-time update to collaborators
        if (user?.uid) {
          try {
            SocketService.emitBoardUpdate(
              boardId,
              user.uid,
              JSON.parse(currentCanvasData),
              isOwner
            );
            console.log(
              `Canvas synchronized with collaborators (isOwner: ${isOwner})`
            );
          } catch (socketError) {
            console.error("Failed to emit board update:", socketError);
          }
        }
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    };

    const debouncedSave = debounce(saveCanvas, 500);

    // Handle all canvas changes
    const handleCanvasChange = () => debouncedSave();

    // Attach event listeners
    const events = [
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

    events.forEach((event) => editor.canvas.on(event, handleCanvasChange));

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      events.forEach((event) => editor.canvas.off(event, handleCanvasChange));
    };
  }, [editor, boardId, user, isOwner, isSessionMode]);
};
