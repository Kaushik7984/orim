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

  //Show all boards
  const loadBoards = async () => {
    try {
      setLoading(true);
      const response = await boardAPI.getAllBoards();
      console.log("BoardProvider: Loaded boards", response);
      setBoards(response);
    } catch (err) {
      console.error("BoardProvider: Failed to load boards", err);
      setError("Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  // show board by id
  const loadBoard = async (id: string) => {
    try {
      setLoading(true);
      const response = await boardAPI.getBoard(id);
      console.log("BoardProvider: Loaded board", response);
      setCurrentBoard(response);
      setBoardId(response._id);
      setBoardName(response.title);
    } catch (err: any) {
      console.error("Load board error", err);
      setError(err?.response?.data?.message || "Board not found");
      setCurrentBoard(null);
    } finally {
      setLoading(false);
    }
  };

  // create board
  const createBoard = useCallback(
    async (title: string) => {
      if (!user) throw new Error("User not authenticated");

      const boardData = { title };

      try {
        const response = await boardAPI.createBoard(boardData);
        console.log("BoardProvider: Created board", response);

        setBoards((prev) => [response, ...prev]);
        setBoardId(response._id);
        setBoardName(response.title);
        setCurrentBoard(response); // Open the new board immediately

        return response;
      } catch (err) {
        console.error("BoardProvider: Create board error", err);
        throw err;
      }
    },
    [user]
  );

  //update board by id
  // const updateBoard = async (id: string, data: Partial<Board>) => {
  //   try {
  //     setLoading(true);
  //     const response = await boardAPI.updateBoard(id, data);
  //     setBoards((prev) => prev.map((b) => (b._id === id ? response : b)));
  //     if (currentBoard?._id === id) setCurrentBoard(response);
  //   } catch (err) {
  //     setError("Failed to update board");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // delete board by id
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

  const joinBoard = async () => {
    if (!boardId || !user) return;

    try {
      const response = await boardAPI.getBoard(boardId);
      if (editor && response?.imageUrl) {
        editor.canvas.loadFromJSON(JSON.parse(response.imageUrl), () => {
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
        updateBoard: boardAPI.updateBoard,
        deleteBoard: boardAPI.deleteBoard,
        loadBoards,
        loadBoard,
        setCurrentBoard,
        updateCanvasData: boardAPI.updateBoard,
        boardId,
        setBoardId,
        boardName,
        setBoardName,
        editor,
        setEditor,
        user: user || undefined,
        joinBoard: async () => Promise.resolve(),
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
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
