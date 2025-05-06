import { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { FabricJSEditor } from "fabricjs-react";

// Interface for the history states
interface HistoryState {
  objects: fabric.Object[];
  timestamp: number;
}

const MAX_HISTORY_SIZE = 20; // Limit history size to prevent memory issues

/**
 * Custom hook to manage canvas history for undo/redo operations
 */
export const useCanvasHistory = (editor: FabricJSEditor | undefined) => {
  // States to track history
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Use refs to avoid dependency issues in useEffect
  const historyRef = useRef<HistoryState[]>([]);
  const currentIndexRef = useRef(-1);
  const isProcessingHistoryRef = useRef(false);

  useEffect(() => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;

    // Function to serialize canvas state
    const saveState = () => {
      if (isProcessingHistoryRef.current) return;

      // Get a copy of all objects on the canvas
      const serializedObjects = canvas.getObjects().map((obj) => {
        // Clone the object to avoid reference issues
        const objJSON = obj.toJSON();
        return objJSON;
      });

      // Create a new history state
      const newState: HistoryState = {
        objects: serializedObjects as unknown as fabric.Object[],
        timestamp: Date.now(),
      };

      // If we're not at the end of the history, truncate
      if (currentIndexRef.current < historyRef.current.length - 1) {
        historyRef.current = historyRef.current.slice(
          0,
          currentIndexRef.current + 1
        );
      }

      // Add new state to history
      historyRef.current.push(newState);

      // Limit history size
      if (historyRef.current.length > MAX_HISTORY_SIZE) {
        historyRef.current.shift();
      }

      currentIndexRef.current = historyRef.current.length - 1;

      // Update state indicators
      setCanUndo(currentIndexRef.current > 0);
      setCanRedo(false);
    };

    // Events that should trigger state saving
    const saveEvents = [
      "object:added",
      "object:removed",
      "object:modified",
      "object:skewing",
      "path:created",
    ];

    // Add event listeners
    saveEvents.forEach((event) => {
      canvas.on(event, saveState);
    });

    // Initialize first state
    saveState();

    return () => {
      // Remove event listeners
      saveEvents.forEach((event) => {
        canvas.off(event, saveState);
      });
    };
  }, [editor]);

  // Function to apply a state from history
  const applyState = (stateIndex: number) => {
    if (
      !editor?.canvas ||
      stateIndex < 0 ||
      stateIndex >= historyRef.current.length
    ) {
      return;
    }

    isProcessingHistoryRef.current = true;

    const canvas = editor.canvas;
    const state = historyRef.current[stateIndex];

    // Clear canvas
    canvas.clear();

    // Load objects from the state
    state.objects.forEach((obj) => {
      fabric.util.enlivenObjects(
        [obj],
        (enlivenedObjects: fabric.Object[]) => {
          enlivenedObjects.forEach((enlivenedObj: fabric.Object) => {
            canvas.add(enlivenedObj);
          });
          canvas.renderAll();
        },
        "fabric"
      );
    });

    currentIndexRef.current = stateIndex;

    // Update button states
    setCanUndo(currentIndexRef.current > 0);
    setCanRedo(currentIndexRef.current < historyRef.current.length - 1);

    isProcessingHistoryRef.current = false;
  };

  // Undo function
  const undo = () => {
    if (canUndo) {
      applyState(currentIndexRef.current - 1);
    }
  };

  // Redo function
  const redo = () => {
    if (canRedo) {
      applyState(currentIndexRef.current + 1);
    }
  };

  return {
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

export default useCanvasHistory;
