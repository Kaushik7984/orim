"use client";

import { createContext, useContext, useState } from "react";

type Tool = "select" | "draw" | "erase";

interface DrawingContextType {
  tool: Tool;
  setTool: (tool: Tool) => void;
}

const DrawingContext = createContext<DrawingContextType | null>(null);

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (!context)
    throw new Error("useDrawing must be used within DrawingProvider");
  return context;
};

export const DrawingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tool, setTool] = useState<Tool>("select");

  return (
    <DrawingContext.Provider value={{ tool, setTool }}>
      {children}
    </DrawingContext.Provider>
  );
};
