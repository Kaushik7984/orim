"use client";
import { socket } from "../socket";
import { BoardContextType, Board } from "../types";
import { IEvent } from "fabric/fabric-impl";
import { FabricJSEditor } from "fabricjs-react";
import { createContext, useCallback, useEffect, useState } from "react";
import { useShapes } from "../utils/useShapes";
import { drawingsAPI } from "@/utils/api";

const BoardContext = createContext<BoardContextType | null>(null);

const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const [boardId, setBoardId] = useState<string | undefined>(undefined);
  const [boardName, setBoardName] = useState<string>("");
  const [editor, setEditor] = useState<FabricJSEditor | undefined>(undefined);
  const [user, setUser] = useState<any>(null);
  const [newJoin, setNewJoin] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [username, setUsername] = useState<string>("");

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

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      socket.auth = { token };
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle socket events
  useEffect(() => {
    socket.on("board-update", (updatedBoard: Board) => {
      setBoard(updatedBoard);
    });

    socket.on("user-joined", ({ username }) => {
      setNewJoin(username);
    });

    return () => {
      socket.off("board-update");
      socket.off("user-joined");
    };
  }, []);

  // Save drawing to backend when canvas changes
  useEffect(() => {
    if (editor && boardId) {
      const saveDrawing = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("No authentication token found");
            return;
          }

          const canvasData = editor.canvas.toJSON();
          await drawingsAPI.updateDrawing(boardId, {
            imageUrl: JSON.stringify(canvasData),
          });
        } catch (error) {
          console.error("Error saving drawing:", error);
        }
      };

      // Save every 5 seconds
      const interval = setInterval(saveDrawing, 5000);
      return () => clearInterval(interval);
    }
  }, [editor, boardId]);

  const joinBoard = async () => {
    try {
      if (!boardId) return;

      // Get drawing data from backend
      const response = await drawingsAPI.getDrawing(boardId);
      if (response.data) {
        // Load drawing data into canvas
        if (editor && response.data.imageUrl) {
          editor.canvas.loadFromJSON(JSON.parse(response.data.imageUrl), () => {
            console.log("Canvas loaded successfully");
          });
        }
      }

      socket.emit("join-board", {
        boardId: boardId,
        username: user?.name || "Anonymous",
      });
    } catch (error) {
      console.error("error joining board", error);
    }
  };

  const createBoard = useCallback(async () => {
    try {
      // Create drawing in backend
      const response = await drawingsAPI.createDrawing({
        title: boardName,
        description: "Collaborative drawing board",
        imageUrl: "",
        isPublic: true,
      });

      // Set the board ID from the created drawing
      setBoardId(response.data._id);

      // Create board in socket
      socket.emit("create-board", {
        boardName,
        username: user?.name || "Anonymous",
        drawingId: response.data._id,
      });
    } catch (error) {
      console.error("error creating board", error);
    }
  }, [boardName, user]);

  const handleCanvasModified = (event: IEvent) => {
    if (event.target) {
      // Handle different shape types
      const shapeType = event.target.type;
      switch (shapeType) {
        case "circle":
          addCircle();
          break;
        case "rect":
          addRectangle();
          break;
        case "triangle":
          addTriangle();
          break;
        case "line":
          addStraightLine();
          break;
        case "polygon":
          addPolygon();
          break;
        case "text":
          addText();
          break;
        case "textbox":
          addTextbox("#000000");
          break;
        case "path":
          addPen();
          break;
      }
    }
  };

  console.log("board", board);

  return (
    <BoardContext.Provider
      value={{
        board,
        setBoard,
        boardId,
        setBoardId,
        boardName,
        setBoardName,
        editor,
        setEditor,
        user,
        path,
        setPath,
        username,
        setUsername,
        joinBoard,
        newJoin,
        setNewJoin,
        createBoard,
        handleCanvasModified,
        addCircle,
        addRectangle,
        addTriangle,
        addStraightLine,
        addText,
        addPolygon,
        addTextbox,
        addPen,
        setUser,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export { BoardProvider, BoardContext };
