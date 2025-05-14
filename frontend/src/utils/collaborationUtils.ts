import { SocketService } from "@/lib/socket";
import { fabric } from "fabric";
import { User } from "firebase/auth";

export type CursorPosition = {
  userId: string;
  username: string;
  x: number;
  y: number;
  color: string;
};

const cursorObjects = new Map<string, fabric.Object>();
const CURSOR_Z_INDEX = 999;

export function initializeBoardCollaboration(
  boardId: string,
  user: User | null,
  canvas: fabric.Canvas | null,
  isOwner: boolean = false
) {
  if (!user || !boardId || !canvas) {
    return { cleanup: () => {}, setupEventListeners: () => {} };
  }

  cleanupCursors(canvas);

  let cursorsVisible = true;
  let hasJoined = false;

  // Only join the board if we haven't already
  if (!hasJoined) {
    SocketService.joinBoard(
      boardId,
      user.uid,
      user.displayName || "Anonymous",
      isOwner
    );
    hasJoined = true;
  }

  const cursorMoveCleanup = SocketService.on(
    "cursor:move",
    (data: CursorPosition) => {
      if (data.userId !== user.uid) {
        if (cursorsVisible) {
          updateCursor(canvas, data);
        }
      }
    }
  );

  // Listen for cursor visibility toggle events
  const handleCursorVisibilityToggle = (event: CustomEvent) => {
    cursorsVisible = !event.detail?.hidden;

    if (canvas) {
      cursorObjects.forEach((cursor) => {
        cursor.set({ visible: cursorsVisible });
      });
      canvas.requestRenderAll();
    }
  };

  window.addEventListener(
    "toggle-cursors-visibility",
    handleCursorVisibilityToggle as EventListener
  );

  const userLeaveCleanup = SocketService.on(
    "board:user-left",
    (data: { userId: string }) => {
      removeCursor(canvas, data.userId);
    }
  );

  //shape:add on
  const shapeAddCleanup = SocketService.on(
    "shape:add",
    (data: { shape: any }) => {
      addShape(canvas, data.shape);
    }
  );

  // shape:modify on
  const shapeModifyCleanup = SocketService.on(
    "shape:modify",
    (data: { objectId: string; props: any }) => {
      updateShape(canvas, data.objectId, data.props);
    }
  );

  // shape:delete on
  const shapeDeleteCleanup = SocketService.on(
    "shape:delete",
    (data: { objectId: string }) => {
      deleteShape(canvas, data.objectId);
    }
  );

  // Set up event listeners for broadcasting cursor movement and shape updates
  const setupEventListeners = () => {
    let lastCursorUpdateTime = 0;
    let lastCursorPos = { x: 0, y: 0 };
    let lastEmittedPos = { x: 0, y: 0 };

    const handleMouseMove = (e: any) => {
      if (!canvas) return;

      const now = Date.now();
      const pointer = canvas.getPointer(e.e);

      lastCursorPos = { x: pointer.x, y: pointer.y };

      const dx = pointer.x - lastEmittedPos.x;
      const dy = pointer.y - lastEmittedPos.y;
      const hasMovedSignificantly = Math.sqrt(dx * dx + dy * dy) > 1;

      if (now - lastCursorUpdateTime < 40 && !hasMovedSignificantly) return;

      lastCursorUpdateTime = now;
      lastEmittedPos = { x: pointer.x, y: pointer.y };

      SocketService.emitCursorMove(
        boardId,
        user.uid,
        user.displayName || "Anonymous",
        pointer.x,
        pointer.y,
        getUserColor(user.uid)
      );
    };

    // Also track mouse entering and leaving the canvas
    const handleMouseEnter = (e: any) => {
      if (!canvas) return;
      const pointer = canvas.getPointer(e.e);

      lastCursorPos = { x: pointer.x, y: pointer.y };
      lastEmittedPos = { x: pointer.x, y: pointer.y };

      SocketService.emitCursorMove(
        boardId,
        user.uid,
        user.displayName || "Anonymous",
        pointer.x,
        pointer.y,
        getUserColor(user.uid)
      );
    };

    const handleMouseOut = () => {
      SocketService.emitCursorMove(
        boardId,
        user.uid,
        user.displayName || "Anonymous",
        -1000,
        -1000,
        getUserColor(user.uid)
      );
    };

    // Shape modifications with debouncing
    const pendingShapeUpdates = new Map<string, NodeJS.Timeout>();
    const handleObjectModified = (e: any) => {
      const obj = e.target;
      if (!obj || obj.data?.isCursor) return;

      if (!(obj as any).id) (obj as any).id = generateId();
      const objId = (obj as any).id;

      if (pendingShapeUpdates.has(objId)) {
        clearTimeout(pendingShapeUpdates.get(objId));
      }

      pendingShapeUpdates.set(
        objId,
        setTimeout(() => {
          SocketService.emitShapeModify(
            boardId,
            objId,
            obj.toObject(["id"]),
            user.uid,
            isOwner
          );
          pendingShapeUpdates.delete(objId);
        }, 50)
      );
    };

    // Handle object deletion
    const handleObjectRemoved = (e: any) => {
      const obj = e.target;
      if (!obj || obj.data?.isCursor) return;

      if ((obj as any).id) {
        SocketService.emitShapeDelete(
          boardId,
          (obj as any).id,
          user.uid,
          isOwner
        );
      }
    };

    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:over", handleMouseEnter);
    canvas.on("mouse:out", handleMouseOut);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:removed", handleObjectRemoved);

    return () => {
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:over", handleMouseEnter);
      canvas.off("mouse:out", handleMouseOut);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("object:removed", handleObjectRemoved);

      pendingShapeUpdates.forEach((timeout) => clearTimeout(timeout));
    };
  };

  const inactivityCleanupInterval = setInterval(() => {
    const now = Date.now();
    cursorObjects.forEach((cursor, userId) => {
      const lastActive = (cursor as any).data?.lastActive || 0;
      if (now - lastActive > 10000) {
        removeCursor(canvas, userId);
      }
    });
  }, 5000);

  const cleanup = () => {
    cursorMoveCleanup();
    userLeaveCleanup();
    shapeAddCleanup();
    shapeModifyCleanup();
    shapeDeleteCleanup();

    window.removeEventListener(
      "toggle-cursors-visibility",
      handleCursorVisibilityToggle as EventListener
    );

    clearInterval(inactivityCleanupInterval);

    SocketService.leaveBoard(boardId, user.uid);

    cleanupCursors(canvas);
  };

  return { cleanup, setupEventListeners };
}

// Helper to clean up all cursors
function cleanupCursors(canvas: fabric.Canvas) {
  if (!canvas) return;
  cursorObjects.forEach((cursor) => {
    canvas.remove(cursor);
  });
  cursorObjects.clear();
  canvas.requestRenderAll();
}

function updateCursor(canvas: fabric.Canvas, data: CursorPosition) {
  if (!canvas) return;

  if (data.x < -900 || data.y < -900) {
    const existingCursor = cursorObjects.get(data.userId);
    if (existingCursor) {
      existingCursor.set({ opacity: 0 });
      canvas.requestRenderAll();
    }
    return;
  }
  let cursor = cursorObjects.get(data.userId);

  if (!cursor) {
    const cursorArrow = new fabric.Path(
      "M0,0 L12,10 L8,10 L13,17 L11,18 L6,11 L0,11 z",
      {
        fill: data.color || "#2D9CDB",
        stroke: "#ffffff",
        strokeWidth: 1,
        selectable: false,
        evented: false,
      }
    );

    // Create name badge that appears directly next to the cursor
    const nameBackground = new fabric.Rect({
      width: 0,
      height: 20,
      left: 16,
      top: -5,
      fill: data.color || "#2D9CDB",
      stroke: "#ffffff",
      strokeWidth: 1,
      rx: 4,
      ry: 4,
      selectable: false,
      evented: false,
    });

    const nameText = new fabric.Text(data.username || "User", {
      fontSize: 11,
      fontFamily: "Arial, sans-serif",
      fill: "#ffffff",
      left: 20,
      top: -1,
      selectable: false,
      evented: false,
    });

    const textWidth = nameText.width || 30;
    nameBackground.set({
      width: textWidth + 8,
    });

    cursor = new fabric.Group([cursorArrow, nameBackground, nameText], {
      left: data.x,
      top: data.y,
      selectable: false,
      evented: false,
      hoverCursor: "default",
      opacity: 1,
      data: {
        isCursor: true,
        userId: data.userId,
        lastActive: Date.now(),
      },
    });

    canvas.add(cursor);
    cursor.moveTo(CURSOR_Z_INDEX);
    cursorObjects.set(data.userId, cursor);
  } else {
    cursor.set({ opacity: 1 });

    cursor.set({
      left: data.x,
      top: data.y,
      data: {
        ...cursor.data,
        lastActive: Date.now(),
      },
    });

    cursor.moveTo(CURSOR_Z_INDEX);
  }

  canvas.requestRenderAll();
}

function removeCursor(canvas: fabric.Canvas, userId: string) {
  if (!canvas) return;

  const cursor = cursorObjects.get(userId);
  if (cursor) {
    canvas.remove(cursor);
    cursorObjects.delete(userId);
    canvas.requestRenderAll();
  }
}

function addShape(canvas: fabric.Canvas, shape: any) {
  if (!canvas || !shape) return;

  if (shape.data && shape.data.isCursor) return;

  const originalRenderOnAddRemove = canvas.renderOnAddRemove;
  canvas.renderOnAddRemove = false;

  // Create object
  fabric.util.enlivenObjects(
    [shape],
    ([obj]: fabric.Object[]) => {
      if (obj) {
        // Mark this object as coming from socket to prevent duplicate events
        (obj as any).__fromSocket = true;

        // Mark when this object was added
        (obj as any)._addedTime = Date.now();

        canvas.add(obj);

        // Remove the marker after a short delay to allow events to process
        setTimeout(() => {
          delete (obj as any).__fromSocket;
          // console.log("Removed __fromSocket marker from:", (obj as any).id);
        }, 100);

        canvas.renderOnAddRemove = originalRenderOnAddRemove;

        // Make sure all cursors stay on top
        cursorObjects.forEach((cursor) => {
          cursor.moveTo(CURSOR_Z_INDEX);
        });

        canvas.requestRenderAll();
      }
    },
    "fabric"
  );
}

function updateShape(canvas: fabric.Canvas, objectId: string, props: any) {
  if (!canvas || !objectId || !props) return;

  if (props.data && props.data.isCursor) return;

  const object = findObjectById(canvas, objectId);
  if (object) {
    object.set(props);
    object.setCoords();
    canvas.requestRenderAll();
  }
}

function deleteShape(canvas: fabric.Canvas, objectId: string) {
  if (!canvas || !objectId) return;

  const object = findObjectById(canvas, objectId);
  if (object) {
    if ((object as any).data && (object as any).data.isCursor) return;

    canvas.remove(object);
    canvas.requestRenderAll();
  }
}

/* Helper functions */

function findObjectById(canvas: fabric.Canvas, objectId: string) {
  return canvas.getObjects().find((obj: any) => obj.id === objectId);
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getUserColor(userId: string): string {
  const colors = [
    "#FF7262",
    "#00C875",
    "#7B68EE",
    "#FF9D48",
    "#2D9CDB",
    "#E256BE",
    "#00BCE8",
    "#4E68F0",
    "#FF9D0A",
  ];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) % 1000000;
  }

  return colors[hash % colors.length];
}
