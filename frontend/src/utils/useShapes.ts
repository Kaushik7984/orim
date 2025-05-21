"use client";
import { getSocket } from "@/lib/socket";
import { fabric } from "fabric";
import { FabricJSEditor } from "fabricjs-react";
import { useEffect, useRef } from "react";

const generateObjectId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

declare module "fabric" {
  namespace fabric {
    interface Canvas {
      _lastPointerPosition?: { x: number; y: number };
      _currentDrawingMode?: string;
      _shapeDrawingState?: {
        isDrawing: boolean;
        startX: number;
        startY: number;
        shape?: fabric.Object;
      };
      _toggleCollaboration?: {
        activate: () => void;
        deactivate: () => void;
      };
    }
  }
}

export const useShapes = (
  editor: FabricJSEditor | undefined,
  boardId?: string
) => {
  const isDrawing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentShape = useRef<fabric.Object | null>(null);

  // Track mouse position
  useEffect(() => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;
    const trackPointerPosition = (e: any) => {
      canvas._lastPointerPosition = canvas.getPointer(e.e);
    };

    canvas.on("mouse:move", trackPointerPosition);
    return () => {
      canvas.off("mouse:move", trackPointerPosition);
    };
  }, [editor?.canvas]);

  const disableDrawing = () => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;
    canvas.isDrawingMode = false;
    isDrawing.current = false;

    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");
    canvas.off("mouse:dblclick");

    if (currentShape.current) {
      canvas.remove(currentShape.current);
      currentShape.current = null;
    }

    if (canvas._toggleCollaboration?.activate) {
      canvas._toggleCollaboration.activate();
    }

    if ((canvas as any).contextContainer) {
      canvas.renderAll();
    }
  };

  // Emit shape creation event to socket
  const emitShape = (shape: fabric.Object, type: string) => {
    if (!boardId) return;

    const socket = getSocket();
    if (socket) {
      const shapeToEmit = (shape as any).toObject(["id"]);
      delete shapeToEmit.__userCreated;

      socket.emit("shape:add", {
        boardId,
        shape: shapeToEmit,
        type,
      });
    }
  };

  const setupDrawingMode = (
    createInitialShape: (pointer: { x: number; y: number }) => fabric.Object,
    updateShape: (
      shape: fabric.Object,
      startPoint: { x: number; y: number },
      endPoint: { x: number; y: number }
    ) => void,
    type: string
  ) => {
    if (!editor?.canvas) return;
    disableDrawing();

    const canvas = editor.canvas;

    if (canvas._toggleCollaboration?.deactivate) {
      canvas._toggleCollaboration.deactivate();
    }

    canvas.isDrawingMode = false;
    isDrawing.current = false;

    // Set cursor style based on tool type
    const cursorStyle = type === "line" ? "crosshair" : "crosshair";
    canvas.defaultCursor = cursorStyle;
    canvas.hoverCursor = cursorStyle;

    canvas.on("mouse:down", (o) => {
      const pointer = canvas.getPointer(o.e);
      isDrawing.current = true;
      startX.current = pointer.x;
      startY.current = pointer.y;

      const shape = createInitialShape(pointer);
      (shape as any).selectable = false;
      currentShape.current = shape;
      canvas.add(shape);
      canvas.renderAll();
    });

    canvas.on("mouse:move", (o) => {
      if (!isDrawing.current || !currentShape.current) return;

      const pointer = canvas.getPointer(o.e);
      const shape = currentShape.current;

      updateShape(shape, { x: startX.current, y: startY.current }, pointer);
      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      if (!isDrawing.current || !currentShape.current) return;

      isDrawing.current = false;
      const shape = currentShape.current;
      shape.setCoords();
      (shape as any).selectable = true;

      // Add unique ID and mark as user created
      (shape as any).id = generateObjectId();
      (shape as any).__userCreated = true;

      emitShape(shape, type);

      canvas.setActiveObject(shape);
      canvas.renderAll();
      currentShape.current = null;

      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");

      // Reset cursor to default
      canvas.defaultCursor = "default";
      canvas.hoverCursor = "default";

      if (canvas._toggleCollaboration?.activate) {
        canvas._toggleCollaboration.activate();
      }
    });
  };

  // Add a circle to the canvas
  const addCircle = () => {
    setupDrawingMode(
      (pointer) =>
        new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 1,
          originX: "left",
          originY: "top",
          fill: "rgba(0,0,0,0)",
          stroke: "#000",
          strokeWidth: 2,
        }),
      (shape, start, end) => {
        const circle = shape as fabric.Circle;

        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);
        const size = Math.min(width, height);

        circle.set({
          radius: size / 2,
          left: Math.min(start.x, end.x),
          top: Math.min(start.y, end.y),
        });
      },
      "circle"
    );
  };

  // Add a rectangle to the canvas
  const addRectangle = () => {
    setupDrawingMode(
      (pointer) =>
        new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 1,
          height: 1,
          fill: "rgba(0,0,0,0)",
          stroke: "#000",
          strokeWidth: 2,
        }),
      (shape, start, end) => {
        const rect = shape as fabric.Rect;
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);

        rect.set({
          left: Math.min(start.x, end.x),
          top: Math.min(start.y, end.y),
          width,
          height,
          originX: "left",
          originY: "top",
        });
      },
      "rectangle"
    );
  };

  // Add a triangle to the canvas
  const addTriangle = () => {
    setupDrawingMode(
      (pointer) =>
        new fabric.Triangle({
          left: pointer.x,
          top: pointer.y,
          width: 1,
          height: 1,
          fill: "rgba(0,0,0,0)",
          stroke: "#000",
          strokeWidth: 2,
        }),

      (shape, start, end) => {
        const triangle = shape as fabric.Triangle;
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);

        triangle.set({
          left: Math.min(start.x, end.x),
          top: Math.min(start.y, end.y),
          width,
          height,
          originX: "left",
          originY: "top",
        });
      },
      "triangle"
    );
  };

  // Add a straight line to the canvas
  const addStraightLine = () => {
    setupDrawingMode(
      (pointer) =>
        new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: "#000",
          strokeWidth: 2,
        }),

      (shape, start, end) => {
        const line = shape as fabric.Line;
        line.set({
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
        });
      },
      "line"
    );
  };

  // Add a polygon to the canvas
  const addPolygon = () => {
    if (!editor?.canvas) return;
    disableDrawing();

    const canvas = editor.canvas;
    const points: fabric.Point[] = [];
    let tempLine: fabric.Line | null = null;

    if (canvas._toggleCollaboration?.deactivate) {
      canvas._toggleCollaboration.deactivate();
    }

    canvas.isDrawingMode = false;

    canvas.on("mouse:down", (o) => {
      const pointer = canvas.getPointer(o.e);
      points.push(new fabric.Point(pointer.x, pointer.y));

      if (points.length === 1) return;

      const p1 = points[points.length - 2];
      const p2 = points[points.length - 1];

      const line = new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
        stroke: "#000",
        strokeWidth: 2,
        selectable: false,
      });

      canvas.add(line);
      canvas.renderAll();
    });

    canvas.on("mouse:move", (o) => {
      if (points.length === 0) return;

      if (tempLine) canvas.remove(tempLine);

      const pointer = canvas.getPointer(o.e);
      const lastPoint = points[points.length - 1];

      tempLine = new fabric.Line(
        [lastPoint.x, lastPoint.y, pointer.x, pointer.y],
        {
          stroke: "#000",
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          selectable: false,
        }
      );

      canvas.add(tempLine);
      canvas.renderAll();
    });

    // Handle double click - complete polygon
    canvas.on("mouse:dblclick", () => {
      // We need at least 3 points for a polygon
      if (points.length < 3) return;

      // Remove the temp line
      if (tempLine) canvas.remove(tempLine);

      // Close the polygon by connecting the last and first points
      const firstPoint = points[0];
      const lastPoint = points[points.length - 1];

      // Create a polygon from the points
      const polygon = new fabric.Polygon(points, {
        fill: "rgba(0,0,0,0)",
        stroke: "#000",
        strokeWidth: 2,
        selectable: true,
      });

      // Remove the temporary lines
      canvas.getObjects().forEach((obj) => {
        if (obj instanceof fabric.Line && !obj.selectable) {
          canvas.remove(obj);
        }
      });

      // Add the polygon to the canvas
      (polygon as any).id = generateObjectId();
      canvas.add(polygon);
      canvas.setActiveObject(polygon);
      canvas.renderAll();

      // Emit the new shape
      emitShape(polygon, "polygon");

      // Reset
      points.length = 0;
      tempLine = null;

      // Remove event listeners and re-enable collaboration
      disableDrawing();
    });
  };

  // Add Text
  const addText = () => {
    if (!editor?.canvas) return;

    disableDrawing();
    const canvas = editor.canvas;

    if (canvas._toggleCollaboration?.deactivate) {
      canvas._toggleCollaboration.deactivate();
    }

    // Set cursor style for text tool
    canvas.defaultCursor = "text";
    canvas.hoverCursor = "text";

    canvas.on("mouse:down", (o) => {
      const pointer = canvas.getPointer(o.e);

      const text = new fabric.IText("Add Text", {
        left: pointer.x,
        top: pointer.y,
        fontFamily: "Times new roman",
        fill: "#333",
        fontSize: 20,
        originX: "left",
        originY: "top",
      });

      addShapeToCanvas(text, "text");

      // Clean up
      canvas.off("mouse:down");
      // Reset cursor to default
      canvas.defaultCursor = "default";
      canvas.hoverCursor = "default";

      if (canvas._toggleCollaboration?.activate) {
        canvas._toggleCollaboration.activate();
      }
    });
  };

  // Add Textbox for Sticky note
  const addTextbox = (color: string) => {
    if (!editor?.canvas) return;

    disableDrawing();
    const canvas = editor.canvas;

    if (canvas._toggleCollaboration?.deactivate) {
      canvas._toggleCollaboration.deactivate();
    }

    canvas.on("mouse:down", (o) => {
      const pointer = canvas.getPointer(o.e);

      const textbox = new fabric.Textbox("\n \n \nStickyNote \n \n \n", {
        left: pointer.x,
        top: pointer.y,
        width: 150,
        fontSize: 16,
        textAlign: "center",
        backgroundColor: color,
        padding: 10,
        originX: "left",
        originY: "top",
      });

      addShapeToCanvas(textbox, "textbox");

      // Clean up
      canvas.off("mouse:down");
      if (canvas._toggleCollaboration?.activate) {
        canvas._toggleCollaboration.activate();
      }
    });
  };

  // Add a shape directly to the canvas non-interactive shape creation)
  const addShapeToCanvas = (shape: fabric.Object, type: string) => {
    if (!editor?.canvas) return;

    if (editor.canvas._toggleCollaboration?.activate) {
      editor.canvas._toggleCollaboration.activate();
    }

    const shapeId = (shape as any).id || generateObjectId();
    (shape as any).id = shapeId;

    const duplicateId = editor.canvas
      .getObjects()
      .some((obj: any) => obj.id === shapeId);

    if (duplicateId) {
      // console.log("Object with same ID already exists, skipping:", shapeId);
      return;
    }

    (shape as any).__userCreated = true;

    editor.canvas.add(shape);
    editor.canvas.setActiveObject(shape);
    editor.canvas.renderAll();

    emitShape(shape, type);
  };

  useEffect(() => {
    return () => {
      if (editor?.canvas) disableDrawing();
    };
  }, [editor]);

  return {
    addCircle,
    addRectangle,
    addTriangle,
    addStraightLine,
    addPolygon,
    addText,
    addTextbox,
    disableDrawing,
  };
};
