import { useEffect } from "react";
import { fabric } from "fabric";

export const useDeleteSelectedObject = (canvas?: fabric.Canvas | null) => {
  useEffect(() => {
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        const activeObject = canvas.getActiveObject();
        const activeGroup = canvas.getActiveObjects();

        if (activeGroup.length > 1) {
          activeGroup.forEach((obj) => canvas.remove(obj));
          canvas.discardActiveObject().renderAll();
        } else if (activeObject) {
          canvas.remove(activeObject);
          canvas.discardActiveObject().renderAll();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvas]);
};
