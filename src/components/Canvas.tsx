import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import "fabric-with-gestures";

// Extend the fabric.Canvas type to include missing methods
declare module "fabric" {
  namespace fabric {
    interface Canvas {
      set(property: string, value: any): fabric.Canvas;
      cloneAsImage(
        object: fabric.Object,
        options?: { multiplier?: number }
      ): void;
      paste(): void;
    }
  }
}

interface CanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
}

const Canvas = ({
  width = window.innerWidth,
  height = window.innerHeight,
  backgroundColor = "#ffffff",
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      selection: true,
    });

    fabricCanvasRef.current = canvas;

    // Handle window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

    // Enable touch events
    canvas.set("allowTouchScrolling", true);

    // Add basic keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObjects = canvas.getActiveObjects();
        activeObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      }

      // Copy
      if (e.ctrlKey && e.key === "c") {
        canvas.getActiveObjects().forEach((obj) => {
          if (obj) {
            canvas.cloneAsImage(obj, {
              multiplier: 1,
            });
          }
        });
      }

      // Paste
      if (e.ctrlKey && e.key === "v") {
        canvas.paste();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, [width, height, backgroundColor]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
