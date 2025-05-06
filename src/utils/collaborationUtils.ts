/**
 * Ultra-simplified Collaboration Utilities
 * Focused on minimal overhead and maximum performance
 */

import { fabric } from "fabric";
import { SocketService } from "@/lib/socket";
import { User } from "firebase/auth";

// Basic cursor data type
export type CursorPosition = {
  userId: string;
  username: string;
  x: number;
  y: number;
  color: string;
};

// Lightweight cursor storage
const cursorObjects = new Map<string, fabric.Object>();
const CURSOR_Z_INDEX = 999; // Make sure cursors stay on top

/**
 * Initializes board collaboration for a user
 */
export function initializeBoardCollaboration(
  boardId: string,
  user: User | null,
  canvas: fabric.Canvas | null,
  isOwner: boolean = false
) {
  if (!user || !boardId || !canvas) {
    return { cleanup: () => {}, setupEventListeners: () => {} };
  }

  // Clear any existing cursors first
  cleanupCursors(canvas);

  // Track cursor visibility state
  let cursorsVisible = true;

  // Join the collaborative board
  SocketService.joinBoard(
    boardId,
    user.uid,
    user.displayName || "Anonymous",
    isOwner
  );

  // Handle cursor movement from other users
  const cursorMoveCleanup = SocketService.on(
    "cursor:move",
    (data: CursorPosition) => {
      if (data.userId !== user.uid) {
        // Skip self
        if (cursorsVisible) {
          updateCursor(canvas, data);
        }
      }
    }
  );

  // Listen for cursor visibility toggle events
  const handleCursorVisibilityToggle = (event: CustomEvent) => {
    cursorsVisible = !event.detail?.hidden;

    // Show/hide all existing cursors
    if (canvas) {
      cursorObjects.forEach((cursor) => {
        cursor.set({ visible: cursorsVisible });
      });
      canvas.requestRenderAll();
    }
  };

  // Add event listener for cursor visibility
  window.addEventListener(
    "toggle-cursors-visibility",
    handleCursorVisibilityToggle as EventListener
  );

  // Handle user leaving
  const userLeaveCleanup = SocketService.on(
    "board:user-left",
    (data: { userId: string }) => {
      removeCursor(canvas, data.userId);
    }
  );

  // Handle canvas updates
  const canvasUpdateCleanup = SocketService.on(
    "board:update",
    (data: { canvasData: any }) => {
      updateCanvas(canvas, data.canvasData);
    }
  );

  // Handle shape events
  const shapeAddCleanup = SocketService.on(
    "shape:add",
    (data: { shape: any }) => {
      addShape(canvas, data.shape);
    }
  );

  const shapeModifyCleanup = SocketService.on(
    "shape:modify",
    (data: { objectId: string; props: any }) => {
      updateShape(canvas, data.objectId, data.props);
    }
  );

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

    // Handle cursor movement with throttling
    const handleMouseMove = (e: any) => {
      if (!canvas) return;

      const now = Date.now();
      const pointer = canvas.getPointer(e.e);

      // Update last cursor position
      lastCursorPos = { x: pointer.x, y: pointer.y };

      // Skip updates if cursor hasn't moved significantly and it's been less than 40ms
      const dx = pointer.x - lastEmittedPos.x;
      const dy = pointer.y - lastEmittedPos.y;
      const hasMovedSignificantly = Math.sqrt(dx * dx + dy * dy) > 1;

      // Only send cursor updates every 40ms (25fps) for smoother tracking
      // But make sure we send it if the position has changed significantly
      if (now - lastCursorUpdateTime < 40 && !hasMovedSignificantly) return;

      lastCursorUpdateTime = now;
      lastEmittedPos = { x: pointer.x, y: pointer.y };

      // Emit cursor movement
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

      // Immediately emit position when mouse enters canvas
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
      // When mouse leaves canvas, notify others
      SocketService.emitCursorMove(
        boardId,
        user.uid,
        user.displayName || "Anonymous",
        -1000, // Move cursor off-screen
        -1000,
        getUserColor(user.uid)
      );
    };

    // Shape modifications with debouncing
    const pendingShapeUpdates = new Map<string, NodeJS.Timeout>();
    const handleObjectModified = (e: any) => {
      const obj = e.target;
      if (!obj || obj.data?.isCursor) return;

      // Ensure object has an ID
      if (!(obj as any).id) (obj as any).id = generateId();
      const objId = (obj as any).id;

      // Debounce updates for this object
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

    // Handle new shapes
    const handleObjectAdded = (e: any) => {
      const obj = e.target;
      if (!obj || obj.data?.isCursor) return;

      // Skip paths (handled separately)
      if (obj instanceof fabric.Path && !(obj as any).id) return;

      // IMPORTANT: Skip objects that were added by the socket event
      // This prevents duplicates - we only emit objects created by the user
      if (obj.__fromSocket) {
        // console.log("Skipping object from socket:", (obj as any).id, obj.type);
        return;
      }

      // console.log("User added shape, emitting:", (obj as any).id, obj.type);

      // Ensure object has an ID
      if (!(obj as any).id) (obj as any).id = generateId();

      // Track when this object was added (for preservation during sync)
      (obj as any)._addedTime = Date.now();

      SocketService.emitShapeAdd(
        boardId,
        obj.toObject(["id"]),
        obj instanceof fabric.Path ? "path" : "object",
        user.uid,
        isOwner
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

    // Attach event listeners
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:over", handleMouseEnter);
    canvas.on("mouse:out", handleMouseOut);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:added", handleObjectAdded);
    canvas.on("object:removed", handleObjectRemoved);

    // Return cleanup function
    return () => {
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:over", handleMouseEnter);
      canvas.off("mouse:out", handleMouseOut);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("object:added", handleObjectAdded);
      canvas.off("object:removed", handleObjectRemoved);

      // Clear any pending timeouts
      pendingShapeUpdates.forEach((timeout) => clearTimeout(timeout));
    };
  };

  // Clean up inactive cursors periodically
  const inactivityCleanupInterval = setInterval(() => {
    const now = Date.now();
    cursorObjects.forEach((cursor, userId) => {
      // Get the timestamp from the cursor data
      const lastActive = (cursor as any).data?.lastActive || 0;
      // Remove if inactive for more than 10 seconds
      if (now - lastActive > 10000) {
        removeCursor(canvas, userId);
      }
    });
  }, 5000); // Check every 5 seconds

  // Main cleanup function
  const cleanup = () => {
    cursorMoveCleanup();
    userLeaveCleanup();
    canvasUpdateCleanup();
    shapeAddCleanup();
    shapeModifyCleanup();
    shapeDeleteCleanup();

    // Remove event listener for cursor visibility
    window.removeEventListener(
      "toggle-cursors-visibility",
      handleCursorVisibilityToggle as EventListener
    );

    // Clear the inactivity cleanup interval
    clearInterval(inactivityCleanupInterval);

    // Leave the board
    SocketService.leaveBoard(boardId, user.uid);

    // Clear cursors
    cleanupCursors(canvas);
  };

  return { cleanup, setupEventListeners };
}

// Helper to clean up all cursors
function cleanupCursors(canvas: fabric.Canvas) {
  if (!canvas) return;

  // Remove all cursor objects from canvas
  cursorObjects.forEach((cursor) => {
    canvas.remove(cursor);
  });

  // Clear the cursor map
  cursorObjects.clear();

  // Force render update
  canvas.requestRenderAll();
}

/* Ultra lightweight cursor implementation */

function updateCursor(canvas: fabric.Canvas, data: CursorPosition) {
  if (!canvas) return;

  // Hide cursor if it's offscreen (mouse left canvas)
  if (data.x < -900 || data.y < -900) {
    const existingCursor = cursorObjects.get(data.userId);
    if (existingCursor) {
      existingCursor.set({ opacity: 0 });
      canvas.requestRenderAll();
    }
    return;
  }

  // Get existing cursor or create new one
  let cursor = cursorObjects.get(data.userId);

  if (!cursor) {
    // Create a cursor pointer (arrow) shape
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
      width: 0, // Will be calculated based on text width
      height: 20,
      left: 16, // Position right of cursor
      top: -5, // Align with cursor
      fill: data.color || "#2D9CDB",
      stroke: "#ffffff",
      strokeWidth: 1,
      rx: 4, // Rounded corners
      ry: 4,
      selectable: false,
      evented: false,
    });

    // Text for the name
    const nameText = new fabric.Text(data.username || "User", {
      fontSize: 11,
      fontFamily: "Arial, sans-serif",
      fill: "#ffffff",
      left: 20, // Position inside the background with padding
      top: -1, // Center in the background
      selectable: false,
      evented: false,
    });

    // Calculate and adjust background width based on text
    const textWidth = nameText.width || 30;
    nameBackground.set({
      width: textWidth + 8, // Add padding
    });

    // Group them together
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

    // Set high z-index to always be on top
    canvas.add(cursor);
    cursor.moveTo(CURSOR_Z_INDEX);
    cursorObjects.set(data.userId, cursor);
  } else {
    // Make visible if it was hidden before
    cursor.set({ opacity: 1 });

    // Update position and activity timestamp
    cursor.set({
      left: data.x,
      top: data.y,
      data: {
        ...cursor.data,
        lastActive: Date.now(),
      },
    });

    // Keep cursor on top of other objects
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

/* Object update functions - keeping them minimal */

function updateCanvas(canvas: fabric.Canvas, canvasData: any) {
  if (!canvas || !canvasData) return;

  // Track objects added in the last 2 seconds to preserve them
  const recentlyAddedObjects = canvas.getObjects().filter((obj: any) => {
    // Skip cursors
    if (obj.data?.isCursor) return false;

    // If the object was added in the last 2 seconds, keep it
    const now = Date.now();
    return obj._addedTime && now - obj._addedTime < 2000;
  });

  // If we have recent objects, let's preserve them
  if (recentlyAddedObjects.length > 0) {
    // console.log(
    //   `Preserving ${recentlyAddedObjects.length} recent objects during sync`
    // );
  }

  // Save current zoom and pan
  const zoom = canvas.getZoom();
  const vpt = canvas.viewportTransform ? [...canvas.viewportTransform] : null;

  // Save existing cursors to restore after loading canvas
  const cursorsToRestore = new Map();
  cursorObjects.forEach((cursor, userId) => {
    cursorsToRestore.set(userId, cursor);
  });

  // Filter out any cursors from the data before loading
  if (canvasData.objects) {
    canvasData.objects = canvasData.objects.filter(
      (obj: any) => !obj.data || !obj.data.isCursor
    );
  }

  // Disable rendering during load
  canvas.renderOnAddRemove = false;

  // Load canvas data
  canvas.loadFromJSON(canvasData, () => {
    if (!canvas) return;

    // Restore zoom and pan
    if (vpt) {
      canvas.setViewportTransform(vpt);
      canvas.setZoom(zoom);
    }

    // Restore cursors
    cleanupCursors(canvas); // First remove any cursors that might have been loaded
    cursorsToRestore.forEach((cursor, userId) => {
      canvas.add(cursor);
      cursor.moveTo(CURSOR_Z_INDEX);
    });

    // Re-add the recently added objects to preserve user's immediate changes
    recentlyAddedObjects.forEach((obj) => {
      // Only add if an object with the same ID doesn't already exist
      if ((obj as any).id && !findObjectById(canvas, (obj as any).id)) {
        canvas.add(obj);
      }
    });

    // Re-enable rendering and update
    canvas.renderOnAddRemove = true;
    canvas.requestRenderAll();
  });
}

function addShape(canvas: fabric.Canvas, shape: any) {
  if (!canvas || !shape) return;

  // Skip if this is a cursor
  if (shape.data && shape.data.isCursor) return;

  // Check if we already have this object on the canvas (by id)
  if (shape.id && findObjectById(canvas, shape.id)) {
    // console.log("Object already exists, skipping:", shape.id);
    return;
  }

  // console.log("Adding shape from socket:", shape.id, shape.type);

  // Disable rendering temporarily
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

  // Skip updates to cursor objects
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
    // Don't delete cursors this way
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

  // Simple hash
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) % 1000000;
  }

  return colors[hash % colors.length];
}
