import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import {
  useRoom,
  useMyPresence,
  useOthers,
  useStorage,
  useMutation,
  Presence,
  Storage,
} from "@/liveblocks.config";

interface LiveCanvasProps {
  boardId: string;
}

interface CursorObjects {
  cursor: fabric.Circle;
  label: fabric.Text;
}

export function LiveCanvas({ boardId }: LiveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const room = useRoom();
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const storage = useStorage<Storage>((root) => root);
  const updateObjects = useMutation(({ storage }, objects) => {
    if (storage) {
      storage.set("objects", objects);
    }
  }, []);

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current || !storage) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      enableRetinaScaling: true,
    });

    fabricRef.current = canvas;

    // Load initial canvas state from storage
    const objects = storage.objects;
    if (objects) {
      canvas.loadFromJSON(objects, () => {
        canvas.renderAll();
      });
    }

    // Handle window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      canvas.renderAll();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, [storage]);

  // Handle real-time cursor updates
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: fabric.IEvent) => {
      const pointer = canvas.getPointer(e.e);
      const presence: Partial<Presence> = {
        cursor: { x: pointer.x, y: pointer.y },
      };
      updateMyPresence(presence);
    };

    canvas.on("mouse:move", handleMouseMove);

    return () => {
      canvas.off("mouse:move", handleMouseMove);
    };
  }, [updateMyPresence]);

  // Handle real-time object updates
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const handleObjectModified = () => {
      const canvasState = canvas.toJSON();
      updateObjects(canvasState);
      updateMyPresence({ isDrawing: false });
    };

    const handleObjectMoving = () => {
      updateMyPresence({ isDrawing: true });
    };

    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:added", handleObjectModified);
    canvas.on("object:removed", handleObjectModified);
    canvas.on("object:moving", handleObjectMoving);
    canvas.on("object:scaling", handleObjectMoving);
    canvas.on("object:rotating", handleObjectMoving);

    return () => {
      canvas.off("object:modified", handleObjectModified);
      canvas.off("object:added", handleObjectModified);
      canvas.off("object:removed", handleObjectModified);
      canvas.off("object:moving", handleObjectMoving);
      canvas.off("object:scaling", handleObjectMoving);
      canvas.off("object:rotating", handleObjectMoving);
    };
  }, [updateMyPresence, updateObjects]);

  // Render other users' cursors
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const cursors = new Map<string, CursorObjects>();

    others.forEach((user) => {
      if (!user.presence?.cursor) return;

      let cursorObjects = cursors.get(user.connectionId.toString());
      if (!cursorObjects) {
        const cursor = new fabric.Circle({
          left: user.presence.cursor.x,
          top: user.presence.cursor.y,
          radius: 5,
          fill: user.presence.color || "#000000",
          opacity: 0.7,
          selectable: false,
          evented: false,
          originX: "center",
          originY: "center",
        });

        const label = new fabric.Text(user.presence.name || "User", {
          left: user.presence.cursor.x + 10,
          top: user.presence.cursor.y + 10,
          fontSize: 12,
          fill: user.presence.color || "#000000",
          selectable: false,
          evented: false,
        });

        cursorObjects = { cursor, label };
        cursors.set(user.connectionId.toString(), cursorObjects);
        canvas.add(cursor);
        canvas.add(label);
      } else {
        cursorObjects.cursor.set({
          left: user.presence.cursor.x,
          top: user.presence.cursor.y,
        });
        cursorObjects.label.set({
          left: user.presence.cursor.x + 10,
          top: user.presence.cursor.y + 10,
        });
        cursorObjects.cursor.setCoords();
        cursorObjects.label.setCoords();
      }
    });

    // Remove cursors of disconnected users
    cursors.forEach((cursorObjects, connectionId) => {
      if (
        !others.some((user) => user.connectionId.toString() === connectionId)
      ) {
        canvas.remove(cursorObjects.cursor);
        canvas.remove(cursorObjects.label);
        cursors.delete(connectionId);
      }
    });

    canvas.renderAll();
  }, [others]);

  return (
    <div className='w-full h-full'>
      <canvas ref={canvasRef} />
    </div>
  );
}
