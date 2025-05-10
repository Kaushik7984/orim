import { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { FabricJSEditor } from "fabricjs-react";
interface HistoryState {
  objects: fabric.Object[];
  timestamp: number;
}

const MAX_HISTORY_SIZE = 20;

export const useCanvasHistory = (editor: FabricJSEditor | undefined) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const historyRef = useRef<HistoryState[]>([]);
  const currentIndexRef = useRef(-1);
  const isProcessingHistoryRef = useRef(false);

  useEffect(() => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;

    const saveState = () => {
      if (isProcessingHistoryRef.current) return;

      const serializedObjects = canvas.getObjects().map((obj) => {
        const objJSON = obj.toJSON();
        return objJSON;
      });

      const newState: HistoryState = {
        objects: serializedObjects as unknown as fabric.Object[],
        timestamp: Date.now(),
      };

      if (currentIndexRef.current < historyRef.current.length - 1) {
        historyRef.current = historyRef.current.slice(
          0,
          currentIndexRef.current + 1
        );
      }

      historyRef.current.push(newState);

      if (historyRef.current.length > MAX_HISTORY_SIZE) {
        historyRef.current.shift();
      }

      currentIndexRef.current = historyRef.current.length - 1;

      setCanUndo(currentIndexRef.current > 0);
      setCanRedo(false);
    };

    const saveEvents = [
      "object:added",
      "object:removed",
      "object:modified",
      "object:skewing",
      "path:created",
    ];

    saveEvents.forEach((event) => {
      canvas.on(event, saveState);
    });

    saveState();

    return () => {
      saveEvents.forEach((event) => {
        canvas.off(event, saveState);
      });
    };
  }, [editor]);

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

    canvas.clear();

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
