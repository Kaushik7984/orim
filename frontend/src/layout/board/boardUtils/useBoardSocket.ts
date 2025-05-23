import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { initializeBoardCollaboration } from "@/utils/collaborationUtils";

export default function useBoardSocket(
  editor: any,
  initialBoardId: string,
  isOwner = false
) {
  const { user } = useAuth();
  const collaborationCleanupRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!editor || !initialBoardId || !user) return;

    const canvas = editor.canvas;
    if (!canvas) return;

    const collaboration = initializeBoardCollaboration(
      initialBoardId,
      user,
      canvas,
      isOwner
    );

    const setupCollaborationEvents = collaboration.setupEventListeners;

    let isCollaborationActive = true;
    let currentEventCleanup: (() => void) | null = null;

    const activateCollaboration = () => {
      if (!isCollaborationActive && !currentEventCleanup) {
        const cleanup = setupCollaborationEvents();
        currentEventCleanup = typeof cleanup === "function" ? cleanup : null;
        isCollaborationActive = true;
        // console.log("Collaboration events activated");
      }
    };

    const deactivateCollaboration = () => {
      if (isCollaborationActive && currentEventCleanup) {
        currentEventCleanup();
        currentEventCleanup = null;
        isCollaborationActive = false;
        // console.log("Collaboration events deactivated for drawing");
      }
    };

    const initialCleanup = setupCollaborationEvents();
    currentEventCleanup =
      typeof initialCleanup === "function" ? initialCleanup : null;

    canvas._toggleCollaboration = {
      activate: activateCollaboration,
      deactivate: deactivateCollaboration,
    };

    collaborationCleanupRef.current = () => {
      if (currentEventCleanup) currentEventCleanup();
      collaboration.cleanup();
    };
  }, [editor, initialBoardId, isOwner, user]);
}
