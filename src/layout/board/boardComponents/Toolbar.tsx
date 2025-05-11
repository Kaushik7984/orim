import BoardContext from "@/context/BoardContext/BoardContext";
import { Tooltip } from "@mui/material";
import { fabric } from "fabric";
import { motion } from "framer-motion";
import { LayoutPanelLeft, Redo, Undo } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import useCanvasHistory from "../boardUtils/useCanvasHistory";
import { items } from "./ToolbarIcons";

const Toolbar = ({
  setIsOpen,
  isOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const boardContext = useContext(BoardContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    addCircle,
    addRectangle,
    addTriangle,
    addStraightLine,
    addText,
    addPolygon,
    addTextbox,
    addPen,
    addHighlighter,
    addEraser,
    addColoredPen,
    disableDrawing,
    editor,
  } = boardContext || {};

  const { undo, redo, canUndo, canRedo } = useCanvasHistory(editor);

  const [activePenColor, setActivePenColor] = useState("#000000");
  const [activePenThickness, setActivePenThickness] = useState(3);

  // Setup drag and drop for the canvas
  useEffect(() => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;
    const canvasElement = canvas.getElement();

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!e.dataTransfer?.files.length) return;

      const file = e.dataTransfer.files[0];
      if (!file.type.match(/image.*/)) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const imgURL = event.target?.result;
        if (typeof imgURL === "string") {
          fabric.Image.fromURL(imgURL, (img) => {
            // Scale image if it's too large
            const maxDimension = 500;
            if (img.width && img.height) {
              if (img.width > maxDimension || img.height > maxDimension) {
                const scaleFactor =
                  maxDimension / Math.max(img.width, img.height);
                img.scale(scaleFactor);
              }
            }

            // Position image at drop point
            const pointer = canvas.getPointer(e);
            img.left = pointer.x;
            img.top = pointer.y;

            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
          });
        }
      };
      reader.readAsDataURL(file);
    };

    canvasElement.addEventListener("dragover", handleDragOver);
    canvasElement.addEventListener("drop", handleDrop);

    return () => {
      canvasElement.removeEventListener("dragover", handleDragOver);
      canvasElement.removeEventListener("drop", handleDrop);
    };
  }, [editor]);

  // Function to handle tool selection
  const handleToolSelect = (name: string) => {
    if (activeItem !== name && editor?.canvas) {
      disableDrawing && disableDrawing();
    }

    setActiveItem(name);

    switch (name) {
      case "Select":
        disableDrawing && disableDrawing();
        if (editor?.canvas) {
          editor.canvas.isDrawingMode = false;
        }
        break;
      case "Text":
        addText && addText();
        break;
      case "Templates":
        // setIsOpen(true);
        break;
      case "Sticky note":
        break;
      case "Shapes":
        break;
      case "Connection line":
        break;
      case "Pen":
        addPen && addPen();
        break;
      case "Highlighter":
        addHighlighter && addHighlighter();
        break;
      case "Eraser":
        addEraser && addEraser();
        break;
      case "Comment":
        break;
      case "Frame":
        break;
      case "Upload":
        // handleFileUpload();
        break;
      case "More apps":
        break;
      default:
        break;
    }
  };

  // Handle shape selection
  const handleShapeSelect = (shapeName: string) => {
    switch (shapeName) {
      case "Rectangle":
        setActiveItem("Shapes");
        addRectangle && addRectangle();
        break;
      case "Circle":
        setActiveItem("Shapes");
        addCircle && addCircle();
        break;
      case "Triangle":
        setActiveItem("Shapes");
        addTriangle && addTriangle();
        break;
      case "Line":
        setActiveItem("Shapes");
        addStraightLine && addStraightLine();
        break;
      case "Straight line":
        setActiveItem("Connection line");
        addStraightLine && addStraightLine();
        break;
      case "Straight arrow":
      case "Curved line":
      case "directional line":
        setActiveItem("Connection line");
        addStraightLine && addStraightLine();
        break;
      case "Polygon":
        setActiveItem("Shapes");
        addPolygon && addPolygon();
        break;
      default:
        // Check if it's a sticky note with color
        if (shapeName.startsWith("Sticky note:")) {
          const color = shapeName.split(":")[1];
          addTextbox && addTextbox(color);
          setActiveItem("Sticky note");
        }
        break;
    }
  };

  // Helper to render icon
  const renderIcon = (item: any) => {
    if (typeof item.icon === "function") {
      return item.icon({
        onClick: (e: React.MouseEvent) => {
          if (
            item.name === "Shapes" ||
            item.name === "Connection line" ||
            item.name === "Pen" ||
            item.name === "Sticky note"
          ) {
            e.stopPropagation();
          }
        },
        onShapeSelect: handleShapeSelect,
        onPenSelect: handlePenSelect,
      });
    } else {
      return item.icon;
    }
  };

  // For ToolbarIcons.tsx pen-related handlers
  const handlePenSelect = (
    penName: string,
    options?: { color?: string; thickness?: number }
  ) => {
    setActiveItem("Pen");

    if (options?.color) {
      setActivePenColor(options.color);
    }

    if (options?.thickness) {
      setActivePenThickness(options.thickness);
    }

    switch (penName) {
      case "Pen":
        return addPen && addPen(options?.color, options?.thickness);
      case "Highlighter":
        return (
          addHighlighter && addHighlighter(options?.color, options?.thickness)
        );
      case "Eraser":
        return addEraser && addEraser();
      case "ColorPen":
        if (options?.color && addColoredPen) {
          return addColoredPen(options.color, options?.thickness || 3);
        }
        return;
      default:
        return;
    }
  };

  return (
    <motion.div className="flex flex-col items-center mt-12 ml-1">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        // onChange={handleFileSelected}
      />
      <div
        className="flex flex-col rounded-md bg-white items-center"
        style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
      >
        {items.map((item) => (
          <Tooltip key={item.name} title={item.name} placement="right" arrow>
            <div
              onClick={() => handleToolSelect(item.name)}
              className={`rounded-md p-2 duration-200 cursor-pointer m-0.5 ${
                activeItem === item.name ? "bg-[#dde4fc]" : "hover:bg-[#dde4fc]"
              }`}
            >
              {renderIcon(item)}
            </div>
          </Tooltip>
        ))}
      </div>

      <div
        className="mt-4 flex flex-col items-center rounded-md bg-white"
        style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
      >
        <Tooltip title="Undo" placement="right" arrow>
          <div
            className={`rounded-md p-2 hover:bg-[#dde4fc] duration-200 cursor-pointer m-0.5 ${
              !canUndo ? "opacity-50" : ""
            }`}
            onClick={undo}
          >
            <Undo />
          </div>
        </Tooltip>
        <Tooltip title="Redo" placement="right" arrow>
          <div
            className={`rounded-md p-2 hover:bg-[#dde4fc] duration-200 cursor-pointer ${
              !canRedo ? "opacity-50" : ""
            }`}
            onClick={redo}
          >
            <Redo />
          </div>
        </Tooltip>
      </div>

      <Tooltip title="Toggle Sidebar" placement="right" arrow>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-md p-2.5 duration-200 cursor-pointer mt-1 ${
            isOpen ? "bg-[#dde4fc]" : "bg-white hover:bg-[#dde4fc]"
          }`}
          style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
        >
          <LayoutPanelLeft />
        </div>
      </Tooltip>
    </motion.div>
  );
};

export default Toolbar;
