"use client";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { Suspense, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@mui/material";
import { BoardContext } from "@/context/BoardContext";
import { socket } from "@/socket";
import { fabric } from "fabric";
import BoardHeader from "./BoardHeader";
import BoardToolbar from "./BoardToolbar";

interface BoardProps {
  boardId: string;
}

const Board = ({ boardId: initialBoardId }: BoardProps) => {
  const { editor, onReady } = useFabricJSEditor();
  const pathname = usePathname();
  const boardContext = useContext(BoardContext);
  const [boardCreated, setBoardCreated] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!boardContext) {
    return <div>Loading...</div>;
  }

  const {
    setBoardName,
    newJoin,
    setEditor,
    board,
    createBoard,
    setBoardId,
    joinBoard,
  } = boardContext;

  // Set initial board ID and join the board
  useEffect(() => {
    setBoardId(initialBoardId);
    joinBoard();
  }, [initialBoardId, setBoardId, joinBoard]);

  useEffect(() => {
    const setEditorInstance = async () => {
      if (editor) {
        editor.canvas.allowTouchScrolling = true;
        editor.canvas.renderOnAddRemove = true;
        editor.canvas.setBackgroundColor("#f5f5f5", () => {
          editor.canvas.requestRenderAll();
        });
        setEditor(editor);
      }
    };

    setEditorInstance();

    return () => {
      setEditor(undefined);
    };
  }, [editor?.canvas, setEditor]);

  useEffect(() => {
    if (!editor) return;

    const grid = 30;
    const gridOptions = {
      color: "rgba(0,0,0,0.1)",
      borderWidth: 1,
    };

    editor.canvas.on("after:render", () => {
      const ctx = editor.canvas.getContext();

      ctx.beginPath();

      const width = editor.canvas.width || 0;
      const height = editor.canvas.height || 0;

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
      ctx.strokeStyle = gridOptions.color;
      ctx.lineWidth = gridOptions.borderWidth;
      ctx.stroke();
    });

    return () => {
      if (editor && editor.canvas) {
        editor.canvas.off("after:render");
      }
    };
  }, [editor]);

  useEffect(() => {
    if (newJoin) console.log("new join", newJoin);
    
    // send draw event from editor
    editor?.canvas.on("path:created", (e: any) => {
      socket.emit("draw", { boardId: initialBoardId, path: e });
    });

    // listen to add circle event from server
    socket.on(
      "add-circle-broadcast",
      (data: { circle: fabric.ICircleOptions | undefined }) => {
        try {
          console.log("add circle broadcast", data);
          const circle = new fabric.Circle(data.circle);
          editor?.canvas.add(circle);
        } catch (error) {
          console.error("Error adding to canvas:", error);
        }
      }
    );

    // listen to draw event from server
    socket.on(
      "draw-broadcast",
      (data: { path: { path: Partial<fabric.Path> } }) => {
        try {
          console.log("draw broadcast", data);
          const path = new fabric.Path(data.path.path.path);
          path.set({ ...data.path.path });
          editor?.canvas.add(path);
        } catch (error) {
          console.error("Error adding to canvas:", error);
        }
      }
    );

    // cleanup
    return () => {
      socket.off("draw-broadcast");
      socket.off("add-circle-broadcast");
      editor?.canvas.off("path:created");
    };
  }, [newJoin, editor, initialBoardId]);

  useEffect(() => {
    const boardName = pathname.split("/")[2];
    setBoardName(boardName);
    
    if (!boardCreated && boardName) {
      createBoard();
      setBoardCreated(true);
    }
  }, [pathname, boardCreated, createBoard, setBoardName]);

  const handleZoomIn = () => {
    if (editor) {
      const zoom = editor.canvas.getZoom() * 1.1;
      editor.canvas.setZoom(zoom);
      setZoomLevel(Math.round(zoom * 100));
    }
  };

  const handleZoomOut = () => {
    if (editor) {
      const zoom = editor.canvas.getZoom() / 1.1;
      editor.canvas.setZoom(zoom);
      setZoomLevel(Math.round(zoom * 100));
    }
  };

  return (
    <div className="relative w-full h-full bg-[#f5f5f5]">
      <BoardHeader 
        boardName={board?.title || "Untitled"} 
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      <BoardToolbar />
      <div className="absolute inset-0 pt-12 pl-12">
        <Suspense
          fallback={<Skeleton className="w-full h-full" />}
        >
          <FabricJSCanvas
            onReady={onReady}
            className="w-full h-full"
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Board;
