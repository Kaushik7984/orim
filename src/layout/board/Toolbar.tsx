import React, { useContext, useState, useEffect, useRef } from "react";
import { items } from "./ToolbarIcons";
import { motion } from "framer-motion";
import { LayoutPanelLeft, Redo, Undo } from "lucide-react";
import { Tooltip } from "@mui/material";
import BoardContext from "@/context/BoardContext/BoardContext";
import useCanvasHistory from "./boardUtils/useCanvasHistory";
import { fabric } from "fabric";

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

  // Extract all the shape creation functions from the context
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

  // Use canvas history hook for undo/redo
  const { undo, redo, canUndo, canRedo } = useCanvasHistory(editor);

  // Create a state to track the active pen color and thickness
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

  // Handle file upload from the toolbar button
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor?.canvas || !e.target.files || e.target.files.length === 0)
      return;

    const file = e.target.files[0];
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

          // Position image at center of canvas
          const center = editor.canvas.getCenter();
          img.left = center.left;
          img.top = center.top;

          editor.canvas.add(img);
          editor.canvas.setActiveObject(img);
          editor.canvas.renderAll();
        });
      }
    };
    reader.readAsDataURL(file);

    // Reset the input so the same file can be uploaded again
    e.target.value = "";
  };

  // Function to handle tool selection
  const handleToolSelect = (name: string) => {
    // Only disable previous drawing mode if we're switching to a different tool
    if (activeItem !== name && editor?.canvas) {
      disableDrawing && disableDrawing();
    }

    // Set the active item for visual indication in the toolbar
    setActiveItem(name);

    // Handle different tools
    switch (name) {
      case "Select":
        // Set select mode (default Fabric.js behavior)
        disableDrawing && disableDrawing();
        if (editor?.canvas) {
          editor.canvas.isDrawingMode = false;
        }
        break;
      case "Text":
        addText && addText();
        break;
      case "Templates":
        // Show templates sidebar
        setIsOpen(true);
        break;
      case "Sticky note":
        // Just show the popover, don't create a note yet
        // The note will be created when a color is selected
        break;
      case "Shapes":
        // Keep open for submenu selection - no direct action needed
        break;
      case "Connection line":
        // Keep open for submenu selection - no direct action needed
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
        // Implement comment functionality
        break;
      case "Frame":
        // Implement frame functionality
        break;
      case "Upload":
        handleFileUpload();
        break;
      case "More apps":
        // Show more apps menu
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
        addStraightLine && addStraightLine(); // For now, use straight line for all connection types
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

  // Helper to render icon - handles both JSX elements and functional components
  const renderIcon = (item: any) => {
    if (typeof item.icon === "function") {
      return item.icon({
        onClick: (e: React.MouseEvent) => {
          // For icons with popover submenus, we need to stop propagation
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
    // Set the active item for visual indication in the toolbar
    setActiveItem("Pen");

    // Update the active pen color and thickness if provided
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
    <motion.div className='flex flex-col items-center mt-12 ml-1'>
      <input
        type='file'
        ref={fileInputRef}
        style={{ display: "none" }}
        accept='image/*'
        onChange={handleFileSelected}
      />
      <div
        className='flex flex-col rounded-md bg-white items-center'
        style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
      >
        {items.map((item) => (
          <Tooltip key={item.name} title={item.name} placement='right' arrow>
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
        className='mt-4 flex flex-col items-center rounded-md bg-white'
        style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
      >
        <Tooltip title='Undo' placement='right' arrow>
          <div
            className={`rounded-md p-2 hover:bg-[#dde4fc] duration-200 cursor-pointer m-0.5 ${
              !canUndo ? "opacity-50" : ""
            }`}
            onClick={undo}
          >
            <Undo />
          </div>
        </Tooltip>
        <Tooltip title='Redo' placement='right' arrow>
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

      <Tooltip title='Toggle Sidebar' placement='right' arrow>
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
