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

  // Zoom and Pan States
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);

  const enablePanMode = () => setIsPanning(true);
  const disablePanMode = () => setIsPanning(false);

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

  // Initialize Socket for real-time updates
  useBoardSocket(user, (board) => setCurrentBoard(board), setNewJoin);
  useBoardAutoSave(editor, boardId); // Auto save functionality will be validated next

  const loadBoards = async () => {
    try {
      setLoading(true);
      const response = await boardAPI.getAllBoards();
      setBoards(response);
    } catch (err) {
      console.error("BoardProvider: Failed to load boards", err);
      setError("Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  const loadBoard = async (id: string) => {
    try {
      setLoading(true);
      const response = await boardAPI.getBoard(id);

      setCurrentBoard(response);
      setBoardId(response._id);
      setBoardName(response.title);

      if (response.canvasData && editor) {
        const canvasData =
          typeof response.canvasData === "string"
            ? response.canvasData
            : JSON.stringify(response.canvasData);

        editor.canvas.loadFromJSON(canvasData, () => {
          editor.canvas.renderAll();
        });
      } else {
        console.log("Canvas data not found or editor not ready");
      }
    } catch (err: any) {
      console.error("Load board error", err);
      setError(err?.response?.data?.message || "Board not found");
      setCurrentBoard(null);
    } finally {
      setLoading(false);
    }
  };

  const createBoard = useCallback(
    async (title: string) => {
      if (!user) throw new Error("User not authenticated");

      const boardData = { title };

      try {
        const response = await boardAPI.createBoard(boardData);
        setBoards((prev) => [response, ...prev]);
        setBoardId(response._id);
        setBoardName(response.title);
        setCurrentBoard(response);
        return response;
      } catch (err) {
        console.error("BoardProvider: Create board error", err);
        setError("Failed to create board");
        throw err;
      }
    },
    [user]
  );

  const updateBoard = async (id: string, data: Partial<Board>) => {
    try {
      setLoading(true);
      const response = await boardAPI.updateBoard(id, data);
      setBoards((prev) => prev.map((b) => (b._id === id ? response : b)));

      if (currentBoard?._id === id) {
        setCurrentBoard(response);
      }

      return response;
    } catch (err) {
      console.error("Failed to update board", err);
      setError("Failed to update board");
      throw err;
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
      console.error("Failed to delete board", err);
      setError("Failed to delete board");
    } finally {
      setLoading(false);
    }
  };

  const joinBoard = async () => {
    if (!boardId || !user) return;

    try {
      const response = await boardAPI.getBoard(boardId);
      console.log("Join board response", response);

      if (editor && response?.canvasData) {
        const canvasData =
          typeof response.canvasData === "string"
            ? response.canvasData
            : JSON.stringify(response.canvasData);

        editor.canvas.loadFromJSON(canvasData, () => {
          editor.canvas.renderAll();
        });
      }

      socket?.emit("join-board", {
        boardId,
        username: user.displayName || "Anonymous",
      });
    } catch (err) {
      console.error("Join board error:", err);
      setError("Failed to join the board");
    }
  };

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
      loadBoards();
    }
  }, [user]);

  // Wait for editor + boardId to load canvas
  useEffect(() => {
    if (editor && boardId) {
      loadBoard(boardId);
    }
  }, [editor, boardId]);

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
        handleCanvasModified: () => console.log("Canvas modified"),
        zoomLevel,
        setZoomLevel,
        enablePanMode,
        disablePanMode,
        isPanning,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
