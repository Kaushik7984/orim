"use client";

import dynamic from "next/dynamic";
import Toolbar from "./Toolbar";
import { DrawingProvider } from "./DrawingContext";

const Canvas = dynamic(() => import("./Canvas"), { ssr: false });

export default function CanvasWrapper() {
  return (
    <DrawingProvider>
      <Toolbar />
      <Canvas />
    </DrawingProvider>
  );
}
