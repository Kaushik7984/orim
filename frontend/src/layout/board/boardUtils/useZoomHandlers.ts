import { useEffect, useState } from "react";
import { fabric } from "fabric";

export default function useZoomHandlers(editor: any) {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => {
    if (!editor) return;
    const zoom = editor.canvas.getZoom() * 1.1;
    const newZoom = Math.min(zoom, 5);
    editor.canvas.setZoom(newZoom);
    setZoomLevel(Math.round(newZoom * 100));
  };

  const handleZoomOut = () => {
    if (!editor) return;
    const zoom = editor.canvas.getZoom() / 1.1;
    const newZoom = Math.max(zoom, 0.2);
    editor.canvas.setZoom(newZoom);
    setZoomLevel(Math.round(newZoom * 100));
  };

  const handleFitView = () => {
    if (!editor) return;
    const canvas = editor.canvas;
    const container = canvas.upperCanvasEl?.parentElement;
    if (!container) return;

    const scaleX = container.clientWidth / canvas.getWidth();
    const scaleY = container.clientHeight / canvas.getHeight();
    const scale = Math.min(scaleX, scaleY);

    canvas.setZoom(scale);
    // canvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);
    setZoomLevel(Math.round(scale * 100));
  };

  const handleDoubleClick = (event: MouseEvent) => {
    event.preventDefault();
    if (!editor) return;
    // Reset zoom to 100%
    editor.canvas.setZoom(1);
    // editor.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    setZoomLevel(100);
  };

  useEffect(() => {
    if (!editor || !editor.canvas) return;
    const canvas = editor.canvas;
    const canvasElement = canvas.upperCanvasEl;

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      const delta = -event.deltaY;
      const zoomStep = 0.1;
      let newZoom = canvas.getZoom() + (delta > 0 ? zoomStep : -zoomStep);

      newZoom = Math.max(0.2, Math.min(5, newZoom));

      const pointer = canvas.getPointer(event as any);
      canvas.zoomToPoint(new fabric.Point(pointer.x, pointer.y), newZoom);
      setZoomLevel(Math.round(newZoom * 100));
    };

    const handleDoubleClick = (event: MouseEvent) => {
      event.preventDefault();
      // Reset zoom to 100%
      canvas.setZoom(1);
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      setZoomLevel(100);
    };

    canvasElement.addEventListener("wheel", handleWheel, { passive: false });
    canvasElement.addEventListener("dblclick", handleDoubleClick);

    return () => {
      canvasElement.removeEventListener("wheel", handleWheel);
      canvasElement.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [editor]);

  return {
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    handleFitView,
  };
}
