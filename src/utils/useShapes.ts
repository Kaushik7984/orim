"use client";
import { fabric } from "fabric";
import { FabricJSEditor } from "fabricjs-react";
import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";

// Helper to generate unique IDs for objects
const generateObjectId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Extend the fabric Canvas type to include our custom properties
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

  // Get mouse position for shape placement
  const getMousePosition = ({ useCenter = false }) => {
    if (!editor?.canvas) return { x: 0, y: 0 };

    const canvas = editor.canvas;

    // If useCenter is true, use the center of the viewport
    if (useCenter) {
      const vpt = canvas.viewportTransform;
      if (!vpt) return { x: 0, y: 0 };

      const zoom = canvas.getZoom();
      const width = canvas.getWidth();
      const height = canvas.getHeight();

      // Calculate center in the current viewport
      return {
        x: (-vpt[4] + width / 2) / zoom,
        y: (-vpt[5] + height / 2) / zoom,
      };
    }

    // Otherwise use the last known pointer position
    if (canvas._lastPointerPosition) {
      return canvas._lastPointerPosition;
    }

    // Fallback to center if no pointer position is available
    return {
      x: canvas.width! / 2 / canvas.getZoom(),
      y: canvas.height! / 2 / canvas.getZoom(),
    };
  };

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

  // Disable drawing mode and clean up
  const disableDrawing = () => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;
    canvas.isDrawingMode = false;
    isDrawing.current = false;

    // Clear event listeners
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");
    canvas.off("mouse:dblclick");

    // Cleanup any temporary objects
    if (currentShape.current) {
      canvas.remove(currentShape.current);
      currentShape.current = null;
    }

    // Re-enable collaboration events if they were disabled
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
      // Clone the object and remove temp properties
      const shapeToEmit = (shape as any).toObject(["id"]);
      delete shapeToEmit.__userCreated;

      socket.emit("shape:add", {
        boardId,
        shape: shapeToEmit,
        type,
      });
    }
  };

  // Set up interactive drawing mode for any shape
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

    // Disable collaboration events while drawing
    if (canvas._toggleCollaboration?.deactivate) {
      canvas._toggleCollaboration.deactivate();
    }

    // Set up drawing mode
    canvas.isDrawingMode = false;
    isDrawing.current = false;

    // Handle mouse down - start shape drawing
    canvas.on("mouse:down", (o) => {
      const pointer = canvas.getPointer(o.e);
      isDrawing.current = true;
      startX.current = pointer.x;
      startY.current = pointer.y;

      // Create initial shape
      const shape = createInitialShape(pointer);
      (shape as any).selectable = false;
      currentShape.current = shape;
      canvas.add(shape);
      canvas.renderAll();
    });

    // Handle mouse move - update shape dimensions
    canvas.on("mouse:move", (o) => {
      if (!isDrawing.current || !currentShape.current) return;

      const pointer = canvas.getPointer(o.e);
      const shape = currentShape.current;

      // Update shape based on mouse movement
      updateShape(shape, { x: startX.current, y: startY.current }, pointer);
      canvas.renderAll();
    });

    // Handle mouse up - finalize the shape
    canvas.on("mouse:up", () => {
      if (!isDrawing.current || !currentShape.current) return;

      isDrawing.current = false;
      const shape = currentShape.current;
      shape.setCoords();
      (shape as any).selectable = true;

      // Add unique ID and mark as user created
      (shape as any).id = generateObjectId();
      (shape as any).__userCreated = true;

      // Emit the shape
      emitShape(shape, type);

      canvas.setActiveObject(shape);
      canvas.renderAll();
      currentShape.current = null;

      // Reset event listeners
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");

      // Re-enable collaboration
      if (canvas._toggleCollaboration?.activate) {
        canvas._toggleCollaboration.activate();
      }
    });
  };

  // Add a circle to the canvas with interactive drawing
  const addCircle = () => {
    setupDrawingMode(
      // Create initial circle
      (pointer) =>
        new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 1,
          originX: "center",
          originY: "center",
          fill: "rgba(0,0,0,0)",
          stroke: "#000",
          strokeWidth: 2,
        }),
      // Update circle during drawing
      (shape, start, end) => {
        const circle = shape as fabric.Circle;
        // Calculate radius based on distance
        const radius = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );
        circle.set({ radius });
      },
      "circle"
    );
  };

  // Add a rectangle to the canvas with interactive drawing
  const addRectangle = () => {
    setupDrawingMode(
      // Create initial rectangle
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
      // Update rectangle during drawing
      (shape, start, end) => {
        const rect = shape as fabric.Rect;
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);

        // Update position and dimensions
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

  // Add a triangle to the canvas with interactive drawing
  const addTriangle = () => {
    setupDrawingMode(
      // Create initial triangle
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
      // Update triangle during drawing
      (shape, start, end) => {
        const triangle = shape as fabric.Triangle;
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);

        // Update position and dimensions
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

  // Add a straight line to the canvas with interactive drawing
  const addStraightLine = () => {
    setupDrawingMode(
      // Create initial line
      (pointer) =>
        new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: "#000",
          strokeWidth: 2,
        }),
      // Update line during drawing
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

  // Add a polygon to the canvas (multiple connected lines)
  const addPolygon = () => {
    if (!editor?.canvas) return;
    disableDrawing();

    const canvas = editor.canvas;
    const points: fabric.Point[] = [];
    let tempLine: fabric.Line | null = null;

    // Disable collaboration events while drawing
    if (canvas._toggleCollaboration?.deactivate) {
      canvas._toggleCollaboration.deactivate();
    }

    canvas.isDrawingMode = false;

    // Handle mouse down - add points
    canvas.on("mouse:down", (o) => {
      const pointer = canvas.getPointer(o.e);
      points.push(new fabric.Point(pointer.x, pointer.y));

      // If this is the first point, just store it
      if (points.length === 1) return;

      // Create a line from the previous point to this point
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

    // Handle mouse move - preview line
    canvas.on("mouse:move", (o) => {
      if (points.length === 0) return;

      // Remove previous temp line if it exists
      if (tempLine) canvas.remove(tempLine);

      // Create a temporary line from the last point to the current mouse position
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

  // Add Text (single-line editable text)
  const addText = () => {
    if (!editor?.canvas) return;

    disableDrawing();
    const canvas = editor.canvas;

    if (canvas._toggleCollaboration?.deactivate) {
      canvas._toggleCollaboration.deactivate();
    }

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

  // Add a shape directly to the canvas (used for non-interactive shape creation)
  const addShapeToCanvas = (shape: fabric.Object, type: string) => {
    if (!editor?.canvas) return;

    // Ensure collaboration is active for single shape placement
    if (editor.canvas._toggleCollaboration?.activate) {
      editor.canvas._toggleCollaboration.activate();
    }

    // Generate a unique ID if not already set
    const shapeId = (shape as any).id || generateObjectId();
    (shape as any).id = shapeId;

    // Check if shape with same ID exists to prevent duplicates
    const duplicateId = editor.canvas
      .getObjects()
      .some((obj: any) => obj.id === shapeId);

    if (duplicateId) {
      console.log("Object with same ID already exists, skipping:", shapeId);
      return;
    }

    // Mark this shape as directly added (not from socket)
    (shape as any).__userCreated = true;

    // Add to canvas and select
    editor.canvas.add(shape);
    editor.canvas.setActiveObject(shape);
    editor.canvas.renderAll();

    // Emit the shape:add event
    emitShape(shape, type);
  };

  // Cleanup on unmount
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
