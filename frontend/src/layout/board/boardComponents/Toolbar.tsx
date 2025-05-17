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
  onToolSelect,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  onToolSelect: (tool: string | null, subTool: string | null) => void;
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

  // Handle tool selection
  const handleToolSelect = (name: string) => {
    setActiveItem(name);
    onToolSelect(name, null);

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
        setIsOpen(true);
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
    onToolSelect("Shapes", shapeName);

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
    const isActive = activeItem === item.name;
    const iconColor = isActive ? "#2563eb" : "#000000"; // Blue for active, black for inactive

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
        color: iconColor,
      });
    } else {
      // Clone the icon and set its color
      return React.cloneElement(item.icon, { color: iconColor });
    }
  };

  // For ToolbarIcons.tsx pen-related handlers
  const handlePenSelect = (
    penName: string,
    options?: { color?: string; thickness?: number }
  ) => {
    setActiveItem("Drawing Tools");
    onToolSelect("Drawing Tools", penName);

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
    <motion.div className='flex flex-col  items-center mt-12 ml-2 md:mt-14'>
      <input
        type='file'
        ref={fileInputRef}
        style={{ display: "none" }}
        accept='image/*'
      />
      <div className='flex flex-col rounded-md bg-white border border-gray-200 items-center shadow-md'
        style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
      >
        {items.map((item) => (
          <div
            key={item.name}
            onClick={() => handleToolSelect(item.name)}
            className="relative group"
          >
            <div
              className={`rounded-md p-2 duration-200 cursor-pointer m-0.5 transition-colors ${activeItem === item.name ? "bg-[#dde4fc]" : "hover:bg-[#dde4fc]"
                }`}
            >
              {renderIcon(item)}
            </div>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {item.name}
            </div>
          </div>

        ))}
      </div>

      <div className='mt-4 flex flex-col items-center rounded-md bg-white border border-gray-200 shadow-md'
        style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
      >
        <div className="relative group">
          <div
            className={`rounded-md p-2 duration-200 cursor-pointer m-0.5 transition-colors hover:bg-[#dde4fc] ${!canUndo ? "opacity-50 pointer-events-none" : ""
              }`}
            onClick={undo}
          >
            <Undo />
          </div>
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            Undo
          </div>
        </div>

        <div className="relative group">
          <div
            className={`rounded-md p-2 duration-200 cursor-pointer transition-colors hover:bg-[#dde4fc] ${!canRedo ? "opacity-50 pointer-events-none" : ""
              }`}
            onClick={redo}
          >
            <Redo />
          </div>
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            Redo
          </div>
        </div>

      </div>

      {/* <Tooltip title='Toggle Sidebar' placement='right' arrow>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-md p-2.5 duration-200 cursor-pointer mt-1 transition-colors ${
            isOpen ? "bg-[#dde4fc]" : "bg-white hover:bg-[#dde4fc]"
          } shadow-md`}
        >
          <LayoutPanelLeft />
        </div>
      </Tooltip> */}
    </motion.div>
  );
};

export default Toolbar;
