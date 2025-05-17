// "use client";
import { getSocket } from "@/lib/socket";
import { fabric } from "fabric";
import { FabricJSEditor } from "fabricjs-react";

interface IPathCreatedEvent extends fabric.IEvent<Event> {
  path: fabric.Path;
}

export const DEFAULT_PEN_COLOR = "#000000";
export const DEFAULT_HIGHLIGHTER_COLOR = "rgba(255, 255, 0, 0.3)";
export const PEN_COLORS = [
  "#000000",
  "#FF0000",
  "#0000FF",
  "#008000",
  "#FFA500",
  "#800080",
  "#FF1493",
  "#00CED1",
];
export const HIGHLIGHTER_COLORS = [
  "rgba(255, 255, 0, 0.3)",
  "rgba(255, 165, 0, 0.3)",
  "rgba(255, 105, 180, 0.3)",
  "rgba(144, 238, 144, 0.3)",
  "rgba(135, 206, 250, 0.3)",
  "rgba(221, 160, 221, 0.3)",
];
export const PEN_THICKNESS = [1, 3, 5, 8, 12, 15];

export const usePen = (
  editor: FabricJSEditor | undefined,
  boardId: string | undefined
) => {
  const socket = getSocket();

  const cleanupCanvasListeners = () => {
    if (!editor?.canvas) return;

    editor.canvas._currentDrawingMode = undefined;
    editor.canvas.isDrawingMode = false;

    // Reset cursor to default
    editor.canvas.defaultCursor = "default";
    editor.canvas.hoverCursor = "default";

    editor.canvas.off("mouse:down");
    editor.canvas.off("mouse:move");
    editor.canvas.off("mouse:up");
    editor.canvas.off("path:created");
  };

  const setupDrawingMode = (color: string, width: number, type: string) => {
    if (!editor?.canvas) return;

    cleanupCanvasListeners();

    editor.canvas.isDrawingMode = true;
    editor.canvas.freeDrawingBrush.width = width;
    editor.canvas.freeDrawingBrush.color = color;

    // Set cursor style based on tool type
    const cursorStyle = type === "highlighter" ? "crosshair" : "crosshair";
    editor.canvas.defaultCursor = cursorStyle;
    editor.canvas.hoverCursor = cursorStyle;

    if (type === "highlighter") {
      if (editor.canvas.freeDrawingBrush instanceof fabric.PencilBrush) {
        (editor.canvas.freeDrawingBrush as any).globalCompositeOperation =
          "multiply";
      }
    } else {
      if (editor.canvas.freeDrawingBrush instanceof fabric.PencilBrush) {
        (editor.canvas.freeDrawingBrush as any).globalCompositeOperation =
          "source-over";
      }
    }

    if (socket && boardId) {
      const handlePathCreated = ((event: IPathCreatedEvent) => {
        const path = event.path;
        if (path) {
          if (type === "highlighter") {
            path.globalCompositeOperation = "multiply";
          }

          (path as any).id = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 11)}`;

          socket.emit("shape:add", {
            boardId,
            shape: path.toObject(["globalCompositeOperation", "id"]),
            type: type,
          });
        }
      }) as any;

      editor.canvas.on("path:created", handlePathCreated);
    }
  };

  const addPen = (color = DEFAULT_PEN_COLOR, thickness = 23) => {
    setupDrawingMode(color, thickness, "path");
  };

  const addHighlighter = (
    color = DEFAULT_HIGHLIGHTER_COLOR,
    thickness = 15
  ) => {
    let highlighterColor = color;
    if (!color.includes("rgba")) {
      if (color.startsWith("#")) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        highlighterColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
      } else if (color.startsWith("rgb(")) {
        highlighterColor = color
          .replace("rgb(", "rgba(")
          .replace(")", ", 0.3)");
      }
    }
    setupDrawingMode(highlighterColor, thickness, "highlighter");
  };

  const addColoredPen = (color: string, thickness = 12) => {
    setupDrawingMode(color, thickness, "path");
  };

  const addEraser = () => {
    if (!editor?.canvas) return;

    cleanupCanvasListeners();

    editor.canvas.on("mouse:down", (options) => {
      const target = options.target;
      if (target) {
        const objectId = (target as any).id || "";

        editor.canvas.remove(target);

        if (socket && boardId && objectId) {
          socket.emit("shape:delete", {
            boardId,
            objectId,
          });
        }
      }
    });
  };

  return {
    addPen,
    addHighlighter,
    addEraser,
    addColoredPen,
  };
};
