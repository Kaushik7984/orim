"use client";

import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import {
  useContext,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { usePathname } from "next/navigation";
import { fabric } from "fabric";

import {
  connectSocket,
  disconnectSocket,
  emitBoardUpdate,
  joinBoard as socketJoinBoard,
  onBoardUpdate,
  offBoardUpdate,
} from "@/lib/socket";

import FabricHeader from "./FabricHeader";
import FabricSidebar from "./FabricSidebar";
import BoardContext from "@/context/BoardContext/BoardContext";
import { BoardContent } from "@/types";

interface BoardProps {
  boardId: string;
}

export interface BoardRef {
  updateContent: (content: BoardContent) => void;
}

const Board = forwardRef<BoardRef, BoardProps>(
  ({ boardId: initialBoardId }, ref) => {
    const { editor, onReady } = useFabricJSEditor();
    const pathname = usePathname();
    const boardContext = useContext(BoardContext);

    const [boardCreated, setBoardCreated] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);

    if (!boardContext) return <div>Loading...</div>;

    const {
      setBoardName,
      setEditor,
      boardId,
      setBoardId,
      joinBoard,
      createBoard,
    } = boardContext;

    const boardNameFromPath = pathname.split("/")[2];

    // Expose ref methods
    useImperativeHandle(ref, () => ({
      updateContent: (content: BoardContent) => {
        if (!editor) return;
        editor.canvas.loadFromJSON(content.canvasData, () => {
          editor.canvas.renderAll();
        });
      },
    }));

    useEffect(() => {
      if (!initialBoardId) return;

      setBoardId(initialBoardId);
      joinBoard();
    }, [initialBoardId]);

    useEffect(() => {
      if (!editor) return;

      editor.canvas.allowTouchScrolling = true;
      editor.canvas.renderOnAddRemove = true;
      editor.canvas.setBackgroundColor("#f5f5f5", () => {
        editor.canvas.requestRenderAll();
      });

      setEditor(editor);
      return () => setEditor(undefined);
    }, [editor]);

    useEffect(() => {
      if (!editor) return;

      const grid = 100;
      const drawGrid = () => {
        const ctx = editor.canvas.getContext();
        const width = editor.canvas.getWidth();
        const height = editor.canvas.getHeight();

        ctx.beginPath();
        for (let i = 0; i <= width / grid; i++) {
          const pos = i * grid;
          ctx.moveTo(pos, 0);
          ctx.lineTo(pos, height);
        }
        for (let i = 0; i <= height / grid; i++) {
          const pos = i * grid;
          ctx.moveTo(0, pos);
          ctx.lineTo(width, pos);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
      };

      editor.canvas.on("after:render", drawGrid);
      return () => {
        editor.canvas.off("after:render", drawGrid);
      };
    }, [editor]);

    useEffect(() => {
      if (!editor || !initialBoardId) return;

      // Connect to the socket and join the board
      connectSocket();
      socketJoinBoard(initialBoardId);

      const handleDrawBroadcast = (content: any) => {
        // Here we assume the content is an object with path and canvasData
        const { path, canvasData } = content;
        const newPath = new fabric.Path(path.path);
        newPath.set({ ...path });
        editor.canvas.add(newPath);
        editor.canvas.loadFromJSON(canvasData, () => {
          editor.canvas.renderAll();
        });
      };

      // Listen to updates coming from the socket server (other users drawing)
      onBoardUpdate(handleDrawBroadcast);

      const handleLocalDraw = (e: any) => {
        const canvasData = editor.canvas.toJSON();
        // Emit updated drawing event to the server
        emitBoardUpdate(initialBoardId, { path: e.path, canvasData });
      };

      // When the user creates a path, send it to the server
      editor.canvas.on("path:created", handleLocalDraw);

      return () => {
        editor.canvas.off("path:created", handleLocalDraw);
        offBoardUpdate();
        disconnectSocket();
      };
    }, [editor, initialBoardId]);

    const handleZoomIn = () => {
      if (!editor) return;
      const zoom = editor.canvas.getZoom() * 1.1;
      editor.canvas.setZoom(zoom);
      setZoomLevel(Math.round(zoom * 100));
    };

    const handleZoomOut = () => {
      if (!editor) return;
      const zoom = editor.canvas.getZoom() / 1.1;
      editor.canvas.setZoom(zoom);
      setZoomLevel(Math.round(zoom * 100));
    };

    return (
      <div className='h-screen w-full flex flex-col'>
        <FabricHeader
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
        <div className='flex flex-1'>
          <FabricSidebar editor={editor} />
          <div className='flex-1 bg-white'>
            <FabricJSCanvas className='h-full w-full' onReady={onReady} />
          </div>
        </div>
      </div>
    );
  }
);

Board.displayName = "Board";

export default Board;
