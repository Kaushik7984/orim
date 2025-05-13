"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import { useShapes } from "@/utils/useShapes";
import { boardAPI } from "@/lib/boardApi";
import { useAuth } from "../AuthContext";
import { BoardContextType, Board } from "@/types";
import BoardContext from "./BoardContext";
import { useBoardAutoSave } from "./useBoardAutoSave";
import { getSocket } from "@/lib/socket";
import { usePen } from "@/utils/usePen";

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const socket = getSocket();

  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [boardId, setBoardId] = useState<string | undefined>(undefined);
  const [boardName, setBoardName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState<FabricJSEditor>();
  const [newJoin, setNewJoin] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  // Zoom and Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const enablePanMode = () => setIsPanning(true);
  const disablePanMode = () => setIsPanning(false);

  // Get basic shape tools
  const {
    addCircle,
    addRectangle,
    addTriangle,
    addStraightLine,
    addPolygon,
    addText,
    addTextbox,
    disableDrawing,
  } = useShapes(editor, boardId || undefined);

  // Get pen tools
  const { addPen, addHighlighter, addEraser, addColoredPen } = usePen(
    editor,
    boardId || undefined
  );

  // Detect if we're in session mode using the current URL path
  const [isSessionMode, setIsSessionMode] = useState(false);

  useEffect(() => {
    // Check if the URL contains "/board/session/"
    const isSession =
      typeof window !== "undefined" &&
      window.location.pathname.includes("/board/session/");
    setIsSessionMode(isSession);
  }, []);

  // Board socket integration is now handled directly in Board.tsx using the collaborationUtils
  // Pass isSessionMode to disable auto-save in session mode
  useBoardAutoSave(editor, boardId || undefined);

  // Load all boards
  const loadBoards = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await boardAPI.getAllBoards();
      setBoards(response);
    } catch (err) {
      console.error("Failed to load boards", err);
      setError("Failed to load boards");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load starred boards
  const loadStarredBoards = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await boardAPI.getStarredBoards();
      setBoards(response);
    } catch (err) {
      console.error("Failed to load starred boards", err);
      setError("Failed to load starred boards");
    } finally {
      setLoading(false);
    }
  }, [user]);

  //open board
  const loadBoard = async (id: string) => {
    setLoading(true);
    try {
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
        console.warn("Canvas data missing or editor not ready");
      }
    } catch (err: any) {
      console.error("Failed to load board", err);
      setError(err?.response?.data?.message || "Board not found");
      setCurrentBoard(null);
    } finally {
      setLoading(false);
    }
  };

  //create new board
  const createBoard = useCallback(
    async (title: string) => {
      if (!user) throw new Error("User not authenticated");

      try {
        const response = await boardAPI.createBoard({ title });
        setBoards((prev) => [response, ...prev]);
        setBoardId(response._id);
        setBoardName(response.title);
        setCurrentBoard(response);
        return response;
      } catch (err) {
        console.error("Failed to create board", err);
        setError("Failed to create board");
        throw err;
      }
    },
    [user]
  );

  //update board
  const updateBoard = async (id: string, data: Partial<Board>) => {
    setLoading(true);
    try {
      const response = await boardAPI.updateBoard(id, data);
      setBoards((prev) => prev.map((b) => (b._id === id ? response : b)));
      if (currentBoard?._id === id) setCurrentBoard(response);
      return response;
    } catch (err) {
      console.error("Failed to update board", err);
      setError("Failed to update board");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //delate board
  const deleteBoard = async (id: string) => {
    setLoading(true);
    try {
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

  // Toggle star status for a board
  const toggleStarBoard = async (id: string) => {
    setLoading(true);
    try {
      const response = await boardAPI.toggleStarBoard(id);
      setBoards((prev) => prev.map((b) => (b._id === id ? response : b)));
      if (currentBoard?._id === id) setCurrentBoard(response);
      return response;
    } catch (err) {
      console.error("Failed to toggle star", err);
      setError("Failed to toggle star");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
      loadBoards();
    }
  }, [user]);

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
        boardId,
        boardName,
        loading,
        error,
        username,
        createBoard,
        loadBoards,
        loadStarredBoards,
        loadBoard,
        updateBoard,
        deleteBoard,
        toggleStarBoard,
        setBoardId,
        setBoardName,
        setCurrentBoard,
        editor,
        setEditor,
        user: user || undefined,
        addCircle,
        addRectangle,
        addTriangle,
        addText,
        addTextbox,
        addStraightLine,
        addPolygon,
        addPen,
        addHighlighter,
        addEraser,
        addColoredPen,
        disableDrawing,
        enablePanMode,
        disablePanMode,
        isPanning,
        zoomLevel,
        setZoomLevel,
        path,
        setPath,
        setNewJoin,
        newJoin,
        setUsername,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
