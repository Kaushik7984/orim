import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";
import { fabric } from "fabric";
import { initializeBoardCollaboration } from "@/utils/collaborationUtils";

// Get API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Custom hook to handle board WebSocket communication
 * @param editor - The canvas editor
 * @param initialBoardId - ID of the board
 * @param isOwner - Whether the current user is the board owner
 * @param isSessionMode - Whether the board is in session mode
 */
export default function useBoardSocket(
  editor: any,
  initialBoardId: string,
  isOwner = false,
  isSessionMode = false
) {
  const { user } = useAuth();
  const collaborationCleanupRef = useRef<() => void>(() => {});
  const canvasEventCleanupRef = useRef<() => void>(() => {});

  // Initialize collaboration when editor, boardId, or user changes
  useEffect(() => {
    if (!editor || !initialBoardId || !user) return;

    const canvas = editor.canvas;
    if (!canvas) return;

    // console.log("Initializing collaboration with owner status:", isOwner);

    // For session mode and non-owner, request latest board state from server
    if (isSessionMode && !isOwner) {
      // console.log("Requesting latest board state as collaborator");
      const socket = getSocket();
      if (socket) {
        socket.emit("board:request-latest-state", { boardId: initialBoardId });
      }
    }

    // Initialize collaboration for this board
    const collaboration = initializeBoardCollaboration(
      initialBoardId,
      user,
      canvas,
      isOwner
    );

    // DON'T automatically set up event listeners here -
    // we'll do this only when not in drawing mode
    // This prevents conflict with drawing tools

    // We'll store the setup function for later use
    const setupCollaborationEvents = collaboration.setupEventListeners;

    // Only set up collaboration events when not drawing
    let isCollaborationActive = true;
    let currentEventCleanup: (() => void) | null = null;

    // Function to activate collaboration events
    const activateCollaboration = () => {
      if (!isCollaborationActive && !currentEventCleanup) {
        const cleanup = setupCollaborationEvents();
        currentEventCleanup = typeof cleanup === "function" ? cleanup : null;
        isCollaborationActive = true;
        // console.log("Collaboration events activated");
      }
    };

    // Function to deactivate collaboration events (when drawing)
    const deactivateCollaboration = () => {
      if (isCollaborationActive && currentEventCleanup) {
        currentEventCleanup();
        currentEventCleanup = null;
        isCollaborationActive = false;
        // console.log("Collaboration events deactivated for drawing");
      }
    };

    // Initial setup of events
    const initialCleanup = setupCollaborationEvents();
    currentEventCleanup =
      typeof initialCleanup === "function" ? initialCleanup : null;

    // Add to the canvas prototype to allow tools to toggle collaboration
    canvas._toggleCollaboration = {
      activate: activateCollaboration,
      deactivate: deactivateCollaboration,
    };

    // Store cleanup functions for later use
    collaborationCleanupRef.current = () => {
      if (currentEventCleanup) currentEventCleanup();
      collaboration.cleanup();
    };

    // Setup shape add handler to avoid duplicates
    const socket = getSocket();
    if (!socket) return;

    const handleShapeAdd = (data: { shape: any; type: string }) => {
      const { shape } = data;
      if (!shape) return;

      // Check if shape already exists on canvas (prevent duplicates)
      const existingObjectWithId = editor.canvas
        .getObjects()
        .find((obj: any) => obj.id === shape.id);

      // if (existingObjectWithId) {
      //   console.log("Shape already exists, not adding duplicate:", shape.id);
      //   return;
      // }

      // Mark the shape as coming from socket to prevent sending back
      shape.__fromSocket = true;

      // Create the object
      fabric.util.enlivenObjects(
        [shape],
        (objects: fabric.Object[]) => {
          if (objects.length > 0) {
            const obj = objects[0];

            // Mark the object to prevent sending it back
            (obj as any).__fromSocket = true;

            // Add to canvas
            editor.canvas.add(obj);

            // Schedule removal of the marker
            setTimeout(() => {
              delete (obj as any).__fromSocket;
            }, 100);

            editor.canvas.renderAll();
          }
        },
        "fabric"
      );
    };

    // Get the latest canvas state
    const handleBoardSync = (canvasData: any) => {
      if (!canvasData || !editor?.canvas) return;

      // Track when we last received a sync to prevent frequent resyncs
      const now = Date.now();
      const lastSync = (editor.canvas as any)._lastSyncTime || 0;

      // Don't sync more than once every 2 seconds to avoid overwriting local changes
      if (now - lastSync < 2000) {
        // console.log("Skipping too frequent sync to preserve local changes");
        return;
      }

      // Record this sync time
      (editor.canvas as any)._lastSyncTime = now;

      // Save current zoom and pan
      const zoom = editor.canvas.getZoom();
      const vpt = editor.canvas.viewportTransform
        ? [...editor.canvas.viewportTransform]
        : null;

      // Disable rendering during load
      editor.canvas.renderOnAddRemove = false;

      // Load canvas data
      editor.canvas.loadFromJSON(canvasData, () => {
        // Restore zoom and pan
        if (vpt) {
          editor.canvas.setViewportTransform(vpt);
          editor.canvas.setZoom(zoom);
        }

        // Re-enable rendering and update
        editor.canvas.renderOnAddRemove = true;
        editor.canvas.requestRenderAll();

        // console.log("Loaded board state from server");
      });
    };

    // Register event handlers
    socket.on("shape:add", handleShapeAdd);
    socket.on("board:sync", handleBoardSync);

    // Cleanup function
    return () => {
      // Remove the toggle collaboration property
      delete canvas._toggleCollaboration;

      // Clean up socket events
      socket.off("shape:add", handleShapeAdd);
      socket.off("board:sync", handleBoardSync);

      // Call the stored cleanup functions
      collaborationCleanupRef.current();
    };
  }, [editor, initialBoardId, isOwner, user, isSessionMode]);
}
