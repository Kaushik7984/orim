"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { useShapes } from "@/utils/useShapes";
import { boardAPI } from "@/utils/boardApi";
import { useAuth } from "../AuthContext";
import { BoardContextType, Board } from "@/types";
import BoardContext from "./BoardContext";
import { useBoardSocket } from "./useBoardSocket";
import { useBoardAutoSave } from "./useBoardAutoSave";
import { getSocket } from "@/lib/socket";

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = getSocket();

  const { user } = useAuth();

  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [boardId, setBoardId] = useState<string>();
  const [boardName, setBoardName] = useState<string>("");
  const [editor, setEditor] = useState<FabricJSEditor>();
  const [newJoin, setNewJoin] = useState<string>("");

  const [path, setPath] = useState<string>("");
  const [username, setUsername] = useState<string>(user?.displayName || "");

  const {
    addCircle,
    addRectangle,
    addTriangle,
    addStraightLine,
    addPolygon,
    addText,
    addTextbox,
    addPen,
  } = useShapes(editor, boardId);

  useBoardSocket(user, (board) => setCurrentBoard(board), setNewJoin);
  useBoardAutoSave(editor, boardId);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const response = await boardAPI.getAllBoards();
      setBoards(response.data);
    } catch (err) {
      setError("Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  const loadBoard = async (id: string) => {
    try {
      setLoading(true);
      const response = await boardAPI.getBoard(id);
      setCurrentBoard(response.data);
    } catch (err) {
      setError("Failed to load board");
    } finally {
      setLoading(false);
    }
  };

  const updateBoard = async (id: string, data: Partial<Board>) => {
    try {
      setLoading(true);
      const response = await boardAPI.updateBoard(id, data);
      setBoards((prev) => prev.map((b) => (b._id === id ? response.data : b)));
      if (currentBoard?._id === id) setCurrentBoard(response.data);
    } catch (err) {
      setError("Failed to update board");
    } finally {
      setLoading(false);
    }
  };

  const deleteBoard = async (id: string) => {
    try {
      setLoading(true);
      await boardAPI.deleteBoard(id);
      setBoards((prev) => prev.filter((b) => b._id !== id));
      if (currentBoard?._id === id) setCurrentBoard(null);
    } catch (err) {
      setError("Failed to delete board");
    } finally {
      setLoading(false);
    }
  };

  const createBoard = useCallback(
    async (
      title: string,
      description = "Collaborative board",
      isPublic = false
    ) => {
      if (!user) throw new Error("User not authenticated");
      try {
        const response = await boardAPI.createBoard({
          title,
          description,
          isPublic,
          imageUrl: "",
        });

        const newBoard = response.data;
        setBoardId(newBoard._id);
        setBoardName(title);

        socket?.emit("create-board", {
          boardName: title,
          username: user.displayName || "Anonymous",
          drawingId: newBoard._id,
        });

        return newBoard;
      } catch (err) {
        console.error("Create board error:", err);
        throw err;
      }
    },
    [user]
  );

  const joinBoard = async () => {
    if (!boardId || !user) return;

    try {
      const response = await boardAPI.getBoard(boardId);
      if (editor && response.data?.imageUrl) {
        editor.canvas.loadFromJSON(JSON.parse(response.data.imageUrl), () => {
          editor.canvas.renderAll();
        });
      }

      socket?.emit("join-board", {
        boardId,
        username: user.displayName || "Anonymous",
      });
    } catch (err) {
      console.error("Join board error:", err);
    }
  };

  const handleCanvasModified = () => {
    // You can implement this to trigger save/throttle events, etc.
    console.log("Canvas was modified");
  };

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
      loadBoards();
    }
  }, [user]);

  return (
    <BoardContext.Provider
      value={{
        boards,
        currentBoard,
        loading,
        error,
        createBoard,
        updateBoard,
        deleteBoard,
        loadBoards,
        loadBoard,
        setCurrentBoard,
        updateCanvasData: updateBoard,
        boardId,
        setBoardId,
        boardName,
        setBoardName,
        editor,
        setEditor,
        user: user || undefined,
        joinBoard,
        newJoin,
        setNewJoin,
        addCircle,
        addRectangle,
        addTriangle,
        addStraightLine,
        addPolygon,
        addText,
        addTextbox,
        addPen,
        path,
        setPath,
        username,
        setUsername,
        handleCanvasModified,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
