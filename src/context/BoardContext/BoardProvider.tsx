"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FabricJSEditor } from "fabricjs-react";
import { useShapes } from "@/utils/useShapes";
import { boardAPI } from "@/lib/boardApi";
import { useAuth } from "../AuthContext";
import { BoardContextType, Board } from "@/types";
import BoardContext from "./BoardContext";
import { useBoardSocket } from "./useBoardSocket";
import { useBoardAutoSave } from "./useBoardAutoSave";
import { getSocket } from "@/lib/socket";

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const socket = getSocket();

  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [boardId, setBoardId] = useState<string>();
  const [boardName, setBoardName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState<FabricJSEditor>();
  const [newJoin, setNewJoin] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [username, setUsername] = useState<string>(user?.displayName || "");

  // Track whether live collaboration is active
  const [isLiveCollaboration, setIsLiveCollaboration] =
    useState<boolean>(false);

  // Zoom and Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const enablePanMode = () => setIsPanning(true);
  const disablePanMode = () => setIsPanning(false);

  // Shape tools
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

  useBoardSocket(user, boardId, editor, setNewJoin);
  useBoardAutoSave(editor, boardId);

  const loadBoards = async () => {
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
  };

  const loadBoard = async (id: string) => {
    // if (isLiveCollaboration) return; // Skip API call if live collaboration is active

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

  // const joinBoard = async (boardId: string) => {
  //   if (!boardId || !user) return;

  //   try {
  //     const response = await boardAPI.getBoard(boardId);

  //     if (editor && response?.canvasData) {
  //       const canvasData =
  //         typeof response.canvasData === "string"
  //           ? response.canvasData
  //           : JSON.stringify(response.canvasData);

  //       editor.canvas.loadFromJSON(canvasData, () => {
  //         editor.canvas.renderAll();
  //       });
  //     }

  //     // Emit a "join-board" socket event when the user joins
  //     socket?.emit("join-board", {
  //       boardId,
  //       username: user.displayName || "Anonymous",
  //     });

  //     // Set live collaboration flag to true
  //     setIsLiveCollaboration(true); // Indicate that collaboration has started
  //   } catch (err) {
  //     console.error("Failed to join the board", err);
  //     setError("Failed to join the board");
  //   }
  // };

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
      loadBoards();
    }
  }, [user]);

  useEffect(() => {
    if (editor && boardId && !isLiveCollaboration) {
      loadBoard(boardId);
    }
  }, [editor, boardId, isLiveCollaboration]);

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
        // joinBoard,
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
        handleCanvasModified: () => {
          // You can emit a socket event here or trigger a save
          console.log("Canvas modified");
        },
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
