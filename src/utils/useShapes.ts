import { fabric } from "fabric";
import { FabricJSEditor } from "fabricjs-react";
import { getSocket } from "@/lib/socket";

export const useShapes = (
  editor: FabricJSEditor | undefined,
  boardId: string | undefined
) => {
  const socket = getSocket();

  const addShapeToCanvas = (shape: fabric.Object, type?: string) => {
    if (!editor?.canvas) return;
    editor.canvas.add(shape);
    editor.canvas.renderAll();
    if (type && socket && boardId) {
      socket.emit("shape:add", {
        boardId,
        shape: shape.toObject(),
        type,
      });
    }
  };

  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 50,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      left: 500,
      top: 500,
    });
    addShapeToCanvas(circle, "circle");
  };

  const addRectangle = () => {
    const rect = new fabric.Rect({
      width: 200,
      height: 200,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      left: 300,
      top: 300,
    });
    addShapeToCanvas(rect, "rectangle");
  };

  const addTriangle = () => {
    const triangle = new fabric.Triangle({
      width: 150,
      height: 150,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      left: 400,
      top: 400,
    });
    addShapeToCanvas(triangle, "triangle");
  };

  const addStraightLine = () => {
    const line = new fabric.Line([50, 100, 200, 200], {
      stroke: "black",
      strokeWidth: 2,
      left: 500,
      top: 500,
    });
    addShapeToCanvas(line, "line");
  };

  const addPolygon = () => {
    const polygon = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: 200, y: 0 },
        { x: 100, y: 200 },
        { x: 0, y: 100 },
      ],
      {
        fill: "transparent",
        stroke: "black",
        strokeWidth: 2,
        left: 600,
        top: 600,
      }
    );
    addShapeToCanvas(polygon, "polygon");
  };

  const addText = () => {
    const text = new fabric.IText("Hello world", {
      left: 500,
      top: 500,
      fontFamily: "Arial Black",
      fill: "#333",
      fontSize: 30,
    });
    addShapeToCanvas(text, "text");
  };

  const addTextbox = (color: string) => {
    const textbox = new fabric.Textbox("Hello world", {
      left: 500,
      top: 500,
      width: 200,
      height: 600,
      fontSize: 30,
      backgroundColor: color,
    });
    addShapeToCanvas(textbox, "textbox");
  };

  const addPen = () => {
    if (!editor?.canvas) return;
    editor.canvas.isDrawingMode = true;
    editor.canvas.freeDrawingBrush.width = 5;
    editor.canvas.freeDrawingBrush.color = "red";
  };

  const disableDrawing = () => {
    if (!editor?.canvas) return;
    editor.canvas.isDrawingMode = false;
  };

  return {
    addCircle,
    addRectangle,
    addTriangle,
    addStraightLine,
    addPolygon,
    addText,
    addTextbox,
    addPen,
    disableDrawing,
  };
};
