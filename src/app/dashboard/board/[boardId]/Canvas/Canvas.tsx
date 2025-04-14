"use client";

import { useRef, useEffect } from "react";
import { useDrawing } from "./DrawingContext";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { tool } = useDrawing();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let drawing = false;

    const startDrawing = (e: MouseEvent) => {
      if (tool !== "draw") return;
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    };

    const draw = (e: MouseEvent) => {
      if (!drawing || tool !== "draw") return;
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    };

    const stopDrawing = () => {
      if (tool !== "draw") return;
      drawing = false;
      ctx.closePath();
    };

    // Handle erase (clear canvas for now)
    if (tool === "erase") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [tool]);

  return (
    <canvas
      ref={canvasRef}
      className='fixed top-0 left-0 w-full h-full z-0'
      style={{ cursor: tool === "draw" ? "crosshair" : "default" }}
    />
  );
}
