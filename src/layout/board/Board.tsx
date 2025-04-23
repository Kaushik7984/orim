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
import ZoomPanel from "./ZoomPanel";
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

      const grid = 100;
      const drawGrid = () => {
        const ctx = editor.canvas.getContext();
        const width = editor.canvas.getWidth();
        const height = editor.canvas.getHeight();
        const scale = editor.canvas.getZoom();
        const scaledGrid = grid * scale;

        ctx.beginPath();
        for (let i = 0; i <= width / scaledGrid; i++) {
          const pos = i * scaledGrid;
          ctx.moveTo(pos, 0);
          ctx.lineTo(pos, height);
        }
        for (let i = 0; i <= height / scaledGrid; i++) {
          const pos = i * scaledGrid;
          ctx.moveTo(0, pos);
          ctx.lineTo(width, pos);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
      };

      editor.canvas.on("after:render", drawGrid);
      setEditor(editor);

      return () => {
        editor.canvas.off("after:render", drawGrid);
        setEditor(undefined);
      };
    }, [editor]);

    useEffect(() => {
      if (!editor || !initialBoardId) return;

      connectSocket();
      socketJoinBoard(initialBoardId);

      const handleDrawBroadcast = (content: any) => {
        const { path, canvasData } = content;
        const newPath = new fabric.Path(path.path);
        newPath.set({ ...path });
        editor.canvas.add(newPath);
        editor.canvas.loadFromJSON(canvasData, () => {
          editor.canvas.renderAll();
        });
      };

      onBoardUpdate(handleDrawBroadcast);

      const handleLocalDraw = (e: any) => {
        const canvasData = editor.canvas.toJSON();
        emitBoardUpdate(initialBoardId, { path: e.path, canvasData });
      };

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
      const zoomLimit = 5;
      const newZoom = Math.min(zoom, zoomLimit);
      editor.canvas.setZoom(newZoom);
      if (Math.round(newZoom * 100) !== zoomLevel) {
        setZoomLevel(Math.round(newZoom * 100));
      }
    };

    const handleZoomOut = () => {
      if (!editor) return;
      const zoom = editor.canvas.getZoom() / 1.1;
      const zoomLimit = 0.2;
      const newZoom = Math.max(zoom, zoomLimit);
      editor.canvas.setZoom(newZoom);
      if (Math.round(newZoom * 100) !== zoomLevel) {
        setZoomLevel(Math.round(newZoom * 100));
      }
    };

    const handleFitView = () => {
      if (!editor) return;

      const canvas = editor.canvas;
      const container = canvas.getElement().parentElement;
      if (!container) return;

      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const scaleX = containerWidth / canvasWidth;
      const scaleY = containerHeight / canvasHeight;
      const scale = Math.min(scaleX, scaleY) * 0.9;

      canvas.setZoom(scale);
      canvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);
      setZoomLevel(Math.round(scale * 100));
    };

    useEffect(() => {
      if (!editor) return;

      const canvas = editor.canvas;

      // Handle mouse wheel zooming with Ctrl
      const handleWheel = (event: WheelEvent) => {
        if (!event.ctrlKey) return; // Only handle if Ctrl is pressed

        event.preventDefault(); // Prevent browser zooming

        const delta = -event.deltaY; // Scroll direction
        const zoom = canvas.getZoom();
        const zoomStep = 0.02;
        let newZoom = delta > 0 ? zoom + zoomStep : zoom - zoomStep;

        const minZoom = 0.2;
        const maxZoom = 5;
        newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));

        // Get mouse position relative to the canvas
        const pointer = canvas.getPointer(event as any);

        // Zoom to the pointer position
        canvas.zoomToPoint(new fabric.Point(pointer.x, pointer.y), newZoom);

        setZoomLevel(Math.round(newZoom * 100));
      };

      // Add event listener to canvas element
      const canvasElement = canvas.getElement();
      canvasElement.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        // Cleanup listener
        canvasElement.removeEventListener("wheel", handleWheel);
      };
    }, [editor]);

    return (
      <div className='h-screen w-full flex flex-col relative'>
        <FabricHeader
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
        <div className='flex flex-1'>
          <FabricSidebar editor={editor} />
          <div className='flex-1 bg-white relative'>
            <FabricJSCanvas className='h-full w-full' onReady={onReady} />
            <ZoomPanel
              zoomLevel={zoomLevel}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitView={handleFitView}
            />
          </div>
        </div>
      </div>
    );
  }
);

Board.displayName = "Board";
export default Board;
