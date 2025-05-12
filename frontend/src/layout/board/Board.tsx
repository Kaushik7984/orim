"use client";

import { useAuth } from "@/context/AuthContext";
import BoardContext from "@/context/BoardContext/BoardContext";
import { SocketService } from "@/lib/socket";
import { BoardContent } from "@/types";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { usePathname } from "next/navigation";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { animationStyles, CollaborationToast } from "./boardComponents/CollaborationToast";
import FabricHeader from "./boardComponents/FabricHeader";
import FabricSidebar from "./boardComponents/FabricSidebar";
import ZoomPanel from "./boardComponents/ZoomPanel";
import useBoardEditor from "./boardUtils/useBoardEditor";
import useBoardSocket from "./boardUtils/useBoardSocket";
import { useDeleteSelectedObject } from "./boardUtils/useDeleteSelectedObject";
import useZoomHandlers from "./boardUtils/useZoomHandlers";

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

    const { zoomLevel, handleZoomIn, handleZoomOut, handleFitView } =
      useZoomHandlers(editor);
    useBoardEditor(editor, boardContext, initialBoardId);

    useBoardSocket(editor, initialBoardId, false);

    useDeleteSelectedObject(editor?.canvas);

    useImperativeHandle(ref, () => ({
      updateContent: (content: BoardContent) => {
        if (!editor) return;
        editor.canvas.loadFromJSON(content.canvasData, () => {
          editor.canvas.renderAll();
        });
      },
    }));

    if (!boardContext) return <div>Loading...</div>;

    return (
      <div className='h-screen w-full flex flex-col relative'>
        <style>{animationStyles}</style>
        <FabricHeader
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
        <div className='flex flex-1'>
          <FabricSidebar editor={editor} />
          <div className='flex-1 bg-[#f5f5f5] relative'>
            <FabricJSCanvas className='h-full w-full' onReady={onReady} />
            <CollaborationToast boardId={initialBoardId} />
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
