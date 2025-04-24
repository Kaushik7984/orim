import { useEffect } from "react";
import { fabric } from "fabric";

export default function useBoardEditor(
  editor: any,
  boardContext: any,
  initialBoardId: string
) {
  useEffect(() => {
    if (!initialBoardId || !boardContext) return;
    boardContext.setBoardId(initialBoardId);
    boardContext.joinBoard();
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
    boardContext.setEditor(editor);

    return () => {
      editor.canvas.off("after:render", drawGrid);
      boardContext.setEditor(undefined);
    };
  }, [editor]);
}
