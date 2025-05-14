import { useEffect, useRef, useState } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { boardAPI } from "@/lib/boardApi";
import { useAuth } from "../AuthContext";
import { getSocket } from "@/lib/socket";
import axios from "axios";

export const useBoardAutoSave = (editor?: FabricJSEditor, boardId?: string) => {
  const lastCanvasDataRef = useRef<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const socket = getSocket();

  // Check if current user is the board owner
  useEffect(() => {
    if (!user || !boardId) return;

    const checkOwnership = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/boards/${boardId}`);

        if (response.data && response.data.ownerId === user.uid) {
          setIsOwner(true);
        }
      } catch (error) {
        setIsOwner(true);
        console.log("New board, setting current user as owner");
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

          // Emit canvas update to other users
          if (socket) {
            socket.emit("board:update", {
              boardId,
              canvasData: JSON.parse(currentCanvasData),
              userId: user?.uid,
            });
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

    // Listen for board updates from other users
    const handleBoardUpdate = (data: { canvasData: any }) => {
      if (data.canvasData && !isSaving) {
        editor.canvas.loadFromJSON(data.canvasData, () => {
          editor.canvas.renderAll();
        });
      }
    };

    if (socket) {
      socket.on("board:update", handleBoardUpdate);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      canvasEvents.forEach((event) => {
        editor.canvas.off(event, handleCanvasChange);
      });

      if (socket) {
        socket.off("board:update", handleBoardUpdate);
      }
    };
  }, [editor, boardId, user, isOwner, socket, isSaving]);

  return {
    isSaving,
    lastSaveTime,
    isOwner,
  };
};
