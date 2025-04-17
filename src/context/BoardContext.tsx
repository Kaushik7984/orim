"use client";
import { socket } from "@/socket";
import { BoardContextType, Board, FabricJSEditor } from "@/types";
import { TEvent } from "fabric/fabric-impl";
import { createContext, useCallback, useEffect, useState } from "react";
import { useShapes } from "@/utils/useShapes";
import { drawingsAPI } from "@/utils/api";
import { useAuth } from "./AuthContext";

const BoardContext = createContext<BoardContextType>({} as BoardContextType);

const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const [boardName, setBoardName] = useState<string>("");
  const [path, setPath] = useState<MouseEvent | undefined>(undefined);
  const [board, setBoard] = useState<Board>();
  const [newJoin, setNewJoin] = useState<string | undefined>("");
  const [boardId, setBoardId] = useState<string | undefined>("");
  const [username, setUsername] = useState<string>("");
  const [editor, setEditor] = useState<FabricJSEditor | undefined>(undefined);
  const { user } = useAuth();
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

  useEffect(() => {
    // listen for user joined broadcast
    socket.on("user-joined-broadcast", (data) => {
      console.log("user joined broadcast", data);
      setBoard(data);
    });

    socket.on("user-joined", ({ username }) => {
      console.log("user joined", username);
      setNewJoin(username);
    });

    return () => {
      socket.off("user-joined");
      socket.off("user-joined-broadcast");
      socket.off("board-created");
    };
  }, []);

  const joinBoard = async () => {
    try {
      if (!boardId) return;

      // Get drawing data from backend
      const drawing = await drawingsAPI.getDrawing(boardId);
      if (drawing) {
        // Load drawing data into canvas
        if (editor && drawing.imageUrl) {
          editor.loadFromJSON(JSON.parse(drawing.imageUrl));
        }
      }

      socket.emit("join-board", {
        boardId: boardId,
        username: user?.name || "Anonymous",
      });

      socket.on("user-joined", ({ username }) => {
        console.log("user joined", username);
        setNewJoin(username);
      });
    } catch (error) {
      console.error("error joining board", error);
    }
  };

  const createBoard = useCallback(async () => {
    try {
      // Create drawing in backend
      const drawing = await drawingsAPI.createDrawing({
        title: boardName,
        description: "Collaborative drawing board",
        imageUrl: "",
        isPublic: true,
      });

      // Set the board ID from the created drawing
      setBoardId(drawing._id);

      // create board in socket
      socket.emit("create-board", {
        boardName,
        username: user?.name || "Anonymous",
        drawingId: drawing._id,
      });

      // listen for board created
      socket.on("board-created", (board: Board) => {
        setBoard(board);
      });
    } catch (error) {
      console.error("error creating board", error);
    }
  }, [boardName, user]);

  // Save drawing to backend when canvas changes
  useEffect(() => {
    if (editor && boardId) {
      const saveDrawing = async () => {
        try {
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

  console.log("board", board);
  return (
    <BoardContext.Provider
      value={{
        createBoard,
        joinBoard,
        boardName,
        setBoardName,
        path,
        setPath,
        newJoin,
        setNewJoin,
        boardId,
        setBoardId,
        username,
        setUsername,
        editor,
        setEditor,
        addCircle,
        addRectangle,
        addTriangle,
        addStraightLine,
        addText,
        addPolygon,
        addTextbox,
        addPen,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export { BoardProvider, BoardContext };
