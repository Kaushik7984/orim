"use client";
import { boardAPI } from "@/lib/boardApi";
import { getSocket } from "@/lib/socket";
import { Board } from "@/types";
import { usePen } from "@/utils/usePen";
import { useShapes } from "@/utils/useShapes";
import { FabricJSEditor } from "fabricjs-react";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import BoardContext from "./BoardContext";
import { useBoardAutoSave } from "./useBoardAutoSave";

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
  const [canvasReady, setCanvasReady] = useState(false);
  const [newJoin, setNewJoin] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [username, setUsername] = useState<string>("");

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
    disableDrawing,
  } = useShapes(editor, boardId || undefined);

  const { addPen, addHighlighter, addEraser, addColoredPen } = usePen(
    editor,
    boardId || undefined
  );

  // Add a ref to track the board ID that has been loaded
  const loadedBoardIdRef = React.useRef<string | undefined>(undefined);

  // Board socket integration is now handled directly in Board.tsx using the collaborationUtils
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
    setCanvasReady(false);

    try {
      const response = await boardAPI.getBoard(id);
      setCurrentBoard(response);
      setBoardId(response._id);
      setBoardName(response.title);

      // Load canvas data if we have it
      if (editor?.canvas && response.canvasData) {
        const canvasData =
          typeof response.canvasData === "string"
            ? response.canvasData
            : JSON.stringify(response.canvasData);

        // Ensure canvas is properly initialized
        if (!editor.canvas.getContext()) {
          console.warn(
            "Canvas context not initialized, waiting for initialization..."
          );
          // Do not set canvasReady to true here, as the canvas is not ready.
          // We'll rely on the useEffect to re-trigger when the canvas is ready.
          return;
        }

        try {
          editor.canvas.loadFromJSON(canvasData, () => {
            editor.canvas.renderAll();
            setCanvasReady(true);
            // Mark this board as loaded after successful load
            loadedBoardIdRef.current = id;
          });
        } catch (loadError) {
          console.error("Error loading canvas data:", loadError);
          setCanvasReady(true);
        }
      } else {
        setCanvasReady(true);
        // Mark this board as loaded if there's no canvas data
        loadedBoardIdRef.current = id;
      }
    } catch (err: any) {
      console.error("Failed to load board:", err);
      setError(err?.response?.data?.message || "Failed to load board");
      setCurrentBoard(null);
      setCanvasReady(true);
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
      // Refresh starred boards list
      await loadStarredBoards();
      return response;
    } catch (err) {
      console.error("Failed to toggle star", err);
      setError("Failed to toggle star");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCollaborator = async (
    boardId: string,
    collaboratorEmail: string
  ) => {
    setLoading(true);
    try {
      const response = await boardAPI.addCollaborator(
        boardId,
        collaboratorEmail
      );
      setBoards((prev) => prev.map((b) => (b._id === boardId ? response : b)));
      if (currentBoard?._id === boardId) setCurrentBoard(response);
      return response;
    } catch (err) {
      console.error("Failed to add collaborator", err);
      setError("Failed to add collaborator");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (
    boardId: string,
    collaboratorEmail: string
  ) => {
    setLoading(true);
    try {
      const response = await boardAPI.removeCollaborator(
        boardId,
        collaboratorEmail
      );
      setBoards((prev) => prev.map((b) => (b._id === boardId ? response : b)));
      if (currentBoard?._id === boardId) setCurrentBoard(response);
      return response;
    } catch (err) {
      console.error("Failed to remove collaborator", err);
      setError("Failed to remove collaborator");
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

  // Handle board loading when editor or boardId changes
  useEffect(() => {
    // Only attempt to load if editor, canvas, boardId are available, and this board hasn't been loaded yet
    if (editor?.canvas && boardId && loadedBoardIdRef.current !== boardId) {
      // Check if canvas context is available before calling loadBoard
      if (editor.canvas.getContext()) {
        loadBoard(boardId);
      } else {
        console.warn(
          "Editor or canvas context not yet available for loading board."
        );
      }
    }
  }, [editor?.canvas, boardId]);

  // Handle initial editor setup
  useEffect(() => {
    if (editor?.canvas && !boardId) {
      setCanvasReady(true);
    }
  }, [editor?.canvas, boardId]);

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
        addCollaborator,
        removeCollaborator,
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
        canvasReady,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
