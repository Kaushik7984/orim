"use client";

import { useState } from "react";
import { Pencil, MousePointer2, Eraser } from "lucide-react";

export default function Toolbar() {
  const [activeTool, setActiveTool] = useState("select");

  const tools = [
    { id: "select", icon: <MousePointer2 size={20} />, label: "Select" },
    { id: "draw", icon: <Pencil size={20} />, label: "Draw" },
    { id: "erase", icon: <Eraser size={20} />, label: "Eraser" },
  ];

  return (
    <div className='fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white border shadow-md rounded-full px-4 py-2 flex items-center space-x-4'>
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setActiveTool(tool.id)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition ${
            activeTool === tool.id
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          {tool.icon}
          <span className='hidden md:inline'>{tool.label}</span>
        </button>
      ))}
    </div>
  );
}
