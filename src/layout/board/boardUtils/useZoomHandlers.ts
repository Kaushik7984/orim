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
    const container = canvas.getElement().parentElement;
    if (!container) return;

    const scaleX = container.clientWidth / canvas.getWidth();
    const scaleY = container.clientHeight / canvas.getHeight();
    const scale = Math.min(scaleX, scaleY) * 1;

    canvas.setZoom(scale);
    canvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);
    setZoomLevel(Math.round(scale * 100));
  };

  useEffect(() => {
    if (!editor) return;
    const canvas = editor.canvas;

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();

      const delta = -event.deltaY;
      const zoomStep = 0.02;
      let newZoom = canvas.getZoom() + (delta > 0 ? zoomStep : -zoomStep);

      newZoom = Math.max(0.2, Math.min(5, newZoom));

      const pointer = canvas.getPointer(event as any);
      canvas.zoomToPoint(new fabric.Point(pointer.x, pointer.y), newZoom);
      setZoomLevel(Math.round(newZoom * 100));
    };

    const canvasElement = canvas.getElement();
    canvasElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvasElement.removeEventListener("wheel", handleWheel);
    };
  }, [editor]);

  return { zoomLevel, handleZoomIn, handleZoomOut, handleFitView };
}
