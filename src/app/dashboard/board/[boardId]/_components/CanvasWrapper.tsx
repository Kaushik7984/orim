"use client";

import dynamic from "next/dynamic";
import Toolbar from "./Toolbar";

const Canvas = dynamic(() => import("./Canvas"), { ssr: false });

export default function CanvasWrapper() {
  return (
    <>
      <Toolbar />
      <Canvas />
    </>
  );
}
