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
    // boardContext.joinBoard();
  }, [initialBoardId]);

  useEffect(() => {
    if (!editor) return;

    editor.canvas.allowTouchScrolling = true; //for mobile
    editor.canvas.renderOnAddRemove = true;

    // Pan functionality
    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        // Right mouse button
        isPanning = true;
        lastPosX = e.clientX;
        lastPosY = e.clientY;
        editor.canvas.selection = false;
        editor.canvas.defaultCursor = "grab";
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;

      const deltaX = e.clientX - lastPosX;
      const deltaY = e.clientY - lastPosY;

      const vpt = editor.canvas.viewportTransform;
      if (vpt) {
        vpt[4] += deltaX;
        vpt[5] += deltaY;
        editor.canvas.requestRenderAll();
      }

      lastPosX = e.clientX;
      lastPosY = e.clientY;
      e.preventDefault();
    };

    const handleMouseUp = () => {
      isPanning = false;
      editor.canvas.selection = true;
      editor.canvas.defaultCursor = "default";
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Touch events for mobile //not proper work yet
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isPanning = true;
        lastPosX = e.touches[0].clientX;
        lastPosY = e.touches[0].clientY;
        editor.canvas.selection = false;
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPanning || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - lastPosX;
      const deltaY = e.touches[0].clientY - lastPosY;

      const vpt = editor.canvas.viewportTransform;
      if (vpt) {
        vpt[4] += deltaX;
        vpt[5] += deltaY;
        editor.canvas.requestRenderAll();
      }

      lastPosX = e.touches[0].clientX;
      lastPosY = e.touches[0].clientY;
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      isPanning = false;
      editor.canvas.selection = true;
    };

    // Grid drawing
    const grid = 100;
    const drawGrid = () => {
      const ctx = editor.canvas.getContext();
      const width = editor.canvas.getWidth();
      const height = editor.canvas.getHeight();
      const scale = editor.canvas.getZoom();
      const vpt = editor.canvas.viewportTransform;
      const scaledGrid = grid * scale;

      if (!vpt) return;

      // Save the current context state
      ctx.save();

      // Set grid properties
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = 1;

      // Calculate the offset based on viewport transform
      const offsetX = vpt[4] % scaledGrid;
      const offsetY = vpt[5] % scaledGrid;

      // Draw vertical lines
      for (let i = -1; i <= width / scaledGrid + 1; i++) {
        const pos = i * scaledGrid + offsetX;
        ctx.beginPath();
        ctx.moveTo(pos, -scaledGrid);
        ctx.lineTo(pos, height + scaledGrid);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let i = -1; i <= height / scaledGrid + 1; i++) {
        const pos = i * scaledGrid + offsetY;
        ctx.beginPath();
        ctx.moveTo(-scaledGrid, pos);
        ctx.lineTo(width + scaledGrid, pos);
        ctx.stroke();
      }

      // Restore the context state
      ctx.restore();
    };

    // Add event listeners
    const canvasElement = editor.canvas.upperCanvasEl;
    canvasElement.addEventListener("mousedown", handleMouseDown);
    canvasElement.addEventListener("mousemove", handleMouseMove);
    canvasElement.addEventListener("mouseup", handleMouseUp);
    canvasElement.addEventListener("mouseleave", handleMouseUp);
    canvasElement.addEventListener("contextmenu", handleContextMenu);
    canvasElement.addEventListener("touchstart", handleTouchStart);
    canvasElement.addEventListener("touchmove", handleTouchMove);
    canvasElement.addEventListener("touchend", handleTouchEnd);

    // Draw grid before objects are rendered
    editor.canvas.on("before:render", drawGrid);
    boardContext.setEditor(editor);

    return () => {
      // Remove event listeners
      canvasElement.removeEventListener("mousedown", handleMouseDown);
      canvasElement.removeEventListener("mousemove", handleMouseMove);
      canvasElement.removeEventListener("mouseup", handleMouseUp);
      canvasElement.removeEventListener("mouseleave", handleMouseUp);
      canvasElement.removeEventListener("contextmenu", handleContextMenu);
      canvasElement.removeEventListener("touchstart", handleTouchStart);
      canvasElement.removeEventListener("touchmove", handleTouchMove);
      canvasElement.removeEventListener("touchend", handleTouchEnd);

      editor.canvas.off("before:render", drawGrid);
      boardContext.setEditor(undefined);
    };
  }, [editor]);
}
