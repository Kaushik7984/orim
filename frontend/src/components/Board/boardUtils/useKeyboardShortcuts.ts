import { useEffect, useRef } from "react";
import { fabric } from "fabric";

interface UseKeyboardShortcutsProps {
  canvas?: fabric.Canvas | null;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const useKeyboardShortcuts = ({
  canvas,
  onUndo,
  onRedo,
}: UseKeyboardShortcutsProps) => {
  const clipboardRef = useRef<fabric.Object[]>([]);

  useEffect(() => {
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl + Z
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        onUndo?.();
      }
      // Redo: Ctrl + Y
      else if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        onRedo?.();
      }
      // Copy: Ctrl + C
      else if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          // If it's a group, copy all objects in the group
          if (activeObject.type === "activeSelection") {
            clipboardRef.current = (activeObject as fabric.ActiveSelection)
              .getObjects()
              .map((obj) => fabric.util.object.clone(obj));
          } else {
            clipboardRef.current = [fabric.util.object.clone(activeObject)];
          }
        }
      }
      // Paste: Ctrl + V
      else if (e.ctrlKey && e.key === "v") {
        e.preventDefault();
        if (clipboardRef.current.length > 0) {
          // Calculate offset for pasted objects
          const offset = 20;

          clipboardRef.current.forEach((obj, index) => {
            const clonedObj = fabric.util.object.clone(obj);
            // Offset each object slightly from the original
            clonedObj.set({
              left: (clonedObj.left || 0) + offset,
              top: (clonedObj.top || 0) + offset,
              evented: true,
              selectable: true,
            });
            canvas.add(clonedObj);
          });

          // Select all pasted objects
          const pastedObjects = canvas
            .getObjects()
            .slice(-clipboardRef.current.length);
          const selection = new fabric.ActiveSelection(pastedObjects, {
            canvas,
          });
          canvas.setActiveObject(selection);
          canvas.requestRenderAll();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvas, onUndo, onRedo]);
};
