import { useEffect, useRef, useState } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { boardAPI } from "@/lib/boardApi";
import { SocketService } from "@/lib/socket";
import { useAuth } from "../AuthContext";
import axios from "axios";

export const useBoardAutoSave = (
  editor?: FabricJSEditor,
  boardId?: string,
  isSessionMode: boolean = false // Add parameter to detect session mode
) => {
  const lastCanvasDataRef = useRef<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  // Check if current user is the board owner
  useEffect(() => {
    if (!user || !boardId) return;

    // Skip ownership check in session mode
    if (isSessionMode) return;

    const checkOwnership = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await axios.get(`${API_URL}/boards/${boardId}`);

        if (response.data && response.data.ownerId === user.uid) {
          setIsOwner(true);
        }
      } catch (error) {
        // If board doesn't exist yet, current user will be the owner
        setIsOwner(true);
        console.log("New board, setting current user as owner");
      }
    };

    checkOwnership();
  }, [boardId, user, isSessionMode]);

  useEffect(() => {
    if (!editor || !boardId) return;

    // Skip autosave completely in session mode
    if (isSessionMode) {
      console.log("Autosave disabled in session mode");
      return;
    }

    const saveCanvas = async () => {
      try {
        const canvasJSON = editor.canvas.toJSON([
          "id",
          "globalCompositeOperation",
        ]);
        const currentCanvasData = JSON.stringify(canvasJSON);

        if (currentCanvasData !== lastCanvasDataRef.current) {
          lastCanvasDataRef.current = currentCanvasData;

          // Only the board owner should save to the database
          if (isOwner) {
            // Update the board on the server
            await boardAPI.updateBoard(boardId, {
              canvasData: JSON.parse(currentCanvasData),
            });
            console.log("Canvas saved to database (owner)");
          }

          // Send real-time update to collaborators regardless of owner status
          if (user?.uid) {
            SocketService.emitBoardUpdate(
              boardId,
              user.uid,
              JSON.parse(currentCanvasData),
              isOwner
            );
          }

          console.log(
            `Canvas synchronized with collaborators (isOwner: ${isOwner}).`
          );
        }
      } catch (err) {
        console.error("Auto-save or sync failed:", err);
      }
    };

    // Debounced auto-save: Save after 500ms of inactivity
    const debounceSave = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(saveCanvas, 500);
    };

    // Track all canvas changes that should trigger a save
    const handleCanvasChange = () => {
      debounceSave();
    };

    // Listen to changes in the editor canvas
    editor.canvas.on("object:modified", handleCanvasChange);
    editor.canvas.on("object:added", handleCanvasChange);
    editor.canvas.on("object:removed", handleCanvasChange);
    editor.canvas.on("path:created", handleCanvasChange);

    // Also listen for property changes that might happen during interactions
    editor.canvas.on("object:rotating", handleCanvasChange);
    editor.canvas.on("object:scaling", handleCanvasChange);
    editor.canvas.on("object:moving", handleCanvasChange);

    // Text changes
    editor.canvas.on("text:changed", handleCanvasChange);

    // Listen for selection changes (might want to sync selection state too)
    editor.canvas.on("selection:created", handleCanvasChange);
    editor.canvas.on("selection:updated", handleCanvasChange);
    editor.canvas.on("selection:cleared", handleCanvasChange);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Clean up all event listeners
      editor.canvas.off("object:modified", handleCanvasChange);
      editor.canvas.off("object:added", handleCanvasChange);
      editor.canvas.off("object:removed", handleCanvasChange);
      editor.canvas.off("path:created", handleCanvasChange);
      editor.canvas.off("object:rotating", handleCanvasChange);
      editor.canvas.off("object:scaling", handleCanvasChange);
      editor.canvas.off("object:moving", handleCanvasChange);
      editor.canvas.off("text:changed", handleCanvasChange);
      editor.canvas.off("selection:created", handleCanvasChange);
      editor.canvas.off("selection:updated", handleCanvasChange);
      editor.canvas.off("selection:cleared", handleCanvasChange);
    };
  }, [editor, boardId, user, isOwner, isSessionMode]);
};
