import { useEffect, useRef, useState } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { boardAPI } from "@/lib/boardApi";
import { useAuth } from "../AuthContext";
import axios from "axios";

export const useBoardAutoSave = (editor?: FabricJSEditor, boardId?: string) => {
  const lastCanvasDataRef = useRef<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

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
      try {
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
            console.log("Canvas saved to database (owner)");
          }
        }
      } catch (err) {
        console.error("Auto-save failed:", err);
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

    editor.canvas.on("object:modified", handleCanvasChange);
    editor.canvas.on("object:added", handleCanvasChange);
    editor.canvas.on("object:removed", handleCanvasChange);
    editor.canvas.on("path:created", handleCanvasChange);
    editor.canvas.on("object:rotating", handleCanvasChange);
    editor.canvas.on("object:scaling", handleCanvasChange);
    editor.canvas.on("object:moving", handleCanvasChange);
    editor.canvas.on("text:changed", handleCanvasChange);
    editor.canvas.on("selection:created", handleCanvasChange);
    editor.canvas.on("selection:updated", handleCanvasChange);
    editor.canvas.on("selection:cleared", handleCanvasChange);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

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
  }, [editor, boardId, user, isOwner]);
};
