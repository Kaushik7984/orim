"use client";

import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { useContext, useImperativeHandle, forwardRef } from "react";
import { usePathname } from "next/navigation";
import FabricHeader from "./FabricHeader";
import FabricSidebar from "./FabricSidebar";
import ZoomPanel from "./ZoomPanel";
import BoardContext from "@/context/BoardContext/BoardContext";
import { BoardContent } from "@/types";
import useBoardEditor from "./boardUtils/useBoardEditor";
import useBoardSocket from "./boardUtils/useBoardSocket";
import useZoomHandlers from "./boardUtils/useZoomHandlers";
import { useDeleteSelectedObject } from "./boardUtils/useDeleteSelectedObject";

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

    const boardNameFromPath = pathname.split("/")[2];

    const { zoomLevel, handleZoomIn, handleZoomOut, handleFitView } =
      useZoomHandlers(editor);
    useBoardEditor(editor, boardContext, initialBoardId);
    useBoardSocket(editor, initialBoardId);

    useImperativeHandle(ref, () => ({
      updateContent: (content: BoardContent) => {
        if (!editor) return;
        editor.canvas.loadFromJSON(content.canvasData, () => {
          editor.canvas.renderAll();
        });
      },
    }));

    if (!boardContext) return <div>Loading...</div>;
    useDeleteSelectedObject(editor?.canvas);

    return (
      <div className='h-screen w-full flex flex-col relative'>
        <FabricHeader
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
        <div className='flex flex-1'>
          <FabricSidebar editor={editor} />
          <div className='flex-1 bg-[#f5f5f5] relative'>
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
