"use client";
import { useContext } from "react";
import { BoardContext } from "@/context/BoardContext";
import { BsCursor, BsSquare } from "react-icons/bs";
import { BiText } from "react-icons/bi";
import { FiCircle } from "react-icons/fi";
import { RxTriangleRight } from "react-icons/rx";
import { LuPencil } from "react-icons/lu";
import { TbHandMove } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineUndo, MdOutlineRedo } from "react-icons/md";

const tools = [
  { icon: BsCursor, name: "Select", action: "select" },
  { icon: TbHandMove, name: "Hand", action: "hand" },
  { icon: LuPencil, name: "Pen", action: "pen" },
  { icon: BsSquare, name: "Rectangle", action: "rectangle" },
  { icon: FiCircle, name: "Circle", action: "circle" },
  { icon: RxTriangleRight, name: "Triangle", action: "triangle" },
  { icon: BiText, name: "Text", action: "text" },
] as const;

const BoardToolbar = () => {
  const boardContext = useContext(BoardContext);

  if (!boardContext) {
    return null;
  }

  const { editor } = boardContext;

  const handleToolClick = (action: typeof tools[number]["action"]) => {
    if (!editor) return;

    switch (action) {
      case "select":
        editor.canvas.isDrawingMode = false;
        break;
      case "hand":
        editor.canvas.isDrawingMode = false;
        // Implement pan mode
        break;
      case "pen":
        editor.canvas.isDrawingMode = true;
        editor.canvas.freeDrawingBrush.width = 2;
        editor.canvas.freeDrawingBrush.color = "#000000";
        break;
      // Add other tool actions
    }
  };

  return (
    <div className="absolute left-0 top-0 bottom-0 w-12 bg-white border-r border-gray-200 flex flex-col items-center py-2 z-50">
      <div className="flex flex-col items-center space-y-1">
        {tools.map((Tool) => (
          <button
            key={Tool.name}
            onClick={() => handleToolClick(Tool.action)}
            className="p-2.5 hover:bg-gray-100 rounded-lg group relative"
            title={Tool.name}
          >
            <Tool.icon className="w-5 h-5 text-gray-700" />
            <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
              {Tool.name}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center space-y-1">
        <button className="p-2.5 hover:bg-gray-100 rounded-lg group relative" title="Add">
          <IoMdAdd className="w-5 h-5 text-gray-700" />
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
            Add
          </span>
        </button>
        <button className="p-2.5 hover:bg-gray-100 rounded-lg group relative" title="Undo">
          <MdOutlineUndo className="w-5 h-5 text-gray-700" />
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
            Undo
          </span>
        </button>
        <button className="p-2.5 hover:bg-gray-100 rounded-lg group relative" title="Redo">
          <MdOutlineRedo className="w-5 h-5 text-gray-700" />
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
            Redo
          </span>
        </button>
      </div>
    </div>
  );
};

export default BoardToolbar; 