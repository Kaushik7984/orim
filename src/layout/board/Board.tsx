"use client";

import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import {
  useContext,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import FabricHeader from "./FabricHeader";
import FabricSidebar from "./FabricSidebar";
import ZoomPanel from "./ZoomPanel";
import BoardContext from "@/context/BoardContext/BoardContext";
import { BoardContent } from "@/types";
import useBoardEditor from "./boardUtils/useBoardEditor";
import useBoardSocket from "./boardUtils/useBoardSocket";
import useZoomHandlers from "./boardUtils/useZoomHandlers";
import { useDeleteSelectedObject } from "./boardUtils/useDeleteSelectedObject";
import { useAuth } from "@/context/AuthContext";
import { getSocket } from "@/lib/socket";
import { SocketService } from "@/lib/socket";

interface BoardProps {
  boardId: string;
}

export interface BoardRef {
  updateContent: (content: BoardContent) => void;
}

// Toast notification for collaboration events
const CollaborationToast = ({ boardId }: { boardId: string }) => {
  const [notifications, setNotifications] = useState<
    { id: string; message: string; color: string }[]
  >([]);
  const { user } = useAuth();

  // Add a notification and remove it after timeout
  const addNotification = (message: string, color: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, color }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  useEffect(() => {
    if (!boardId || !user) return;

    const socket = getSocket();
    if (!socket) return;

    // Handle when users join
    const handleUserJoined = ({
      userId,
      username,
    }: {
      userId: string;
      username: string;
    }) => {
      if (userId === user.uid) return; // Skip self
      addNotification(`${username || "Someone"} joined the board`, "#27AE60");
    };

    // Handle when users leave
    const handleUserLeave = ({ userId }: { userId: string }) => {
      // We don't have the username here, but we could store a map of user IDs to names
      addNotification(`A collaborator left the board`, "#EB5757");
    };

    socket.on("board:user-joined", handleUserJoined);
    socket.on("board:user-left", handleUserLeave);

    return () => {
      socket.off("board:user-joined", handleUserJoined);
      socket.off("board:user-left", handleUserLeave);
    };
  }, [boardId, user]);

  if (notifications.length === 0) return null;

  return (
    <div className='fixed bottom-4 left-4 flex flex-col gap-2 z-20'>
      {notifications.map(({ id, message, color }) => (
        <div
          key={id}
          className='bg-white/95 rounded-md shadow-md px-4 py-3 text-sm font-medium animate-fade-in max-w-xs'
          style={{ borderLeft: `4px solid ${color}` }}
        >
          {message}
        </div>
      ))}
    </div>
  );
};

// Animation styles for notifications
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

// Collaboration avatars component - improved to use CursorPosition type
const CollaboratorAvatars = ({ boardId }: { boardId: string }) => {
  const [activeUsers, setActiveUsers] = useState<
    { userId: string; username: string; color: string; lastActive: number }[]
  >([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!boardId || !user) return;

    // For tracking active collaborators
    const collaborators = new Map<
      string,
      {
        userId: string;
        username: string;
        color: string;
        lastActive: number;
      }
    >();

    // Listen for user left events
    const userLeftListener = SocketService.on(
      "board:user-left",
      (data: { userId: string }) => {
        collaborators.delete(data.userId);
        updateCollaboratorsList();
      }
    );

    // Update the collaborators list from the map
    const updateCollaboratorsList = () => {
      const activeList = Array.from(collaborators.values())
        .filter((c) => c.userId !== user.uid) // Filter out self
        .sort((a, b) => b.lastActive - a.lastActive); // Most recently active first

      setActiveUsers(activeList);
    };

    // Clean up inactive users every 10 seconds
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      let updated = false;

      collaborators.forEach((collaborator, id) => {
        // Remove if inactive for more than 30 seconds
        if (now - collaborator.lastActive > 30000) {
          collaborators.delete(id);
          updated = true;
        }
      });

      if (updated) {
        updateCollaboratorsList();
      }
    }, 10000);

    return () => {
      // cursorMoveListener();
      userLeftListener();
      clearInterval(cleanupInterval);
    };
  }, [boardId, user]);

  if (activeUsers.length === 0) return null;

  return (
    <div className='absolute top-4 right-4 flex items-center bg-white/90 rounded-full px-3 py-1.5 shadow-md z-10'>
      <div className='mr-2 text-sm font-medium text-gray-600'>
        {activeUsers.length}{" "}
        {activeUsers.length === 1 ? "collaborator" : "collaborators"}
      </div>
      <div className='flex -space-x-2'>
        {activeUsers.slice(0, 3).map((user, i) => (
          <div
            key={user.userId}
            className='w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white'
            style={{
              backgroundColor: user.color,
              zIndex: 10 - i,
            }}
            title={user.username}
          >
            {user.username.substring(0, 1).toUpperCase()}
          </div>
        ))}
        {activeUsers.length > 3 && (
          <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-white'>
            +{activeUsers.length - 3}
          </div>
        )}
      </div>
    </div>
  );
};

const Board = forwardRef<BoardRef, BoardProps>(
  ({ boardId: initialBoardId }, ref) => {
    const { editor, onReady } = useFabricJSEditor();
    const pathname = usePathname();
    const boardContext = useContext(BoardContext);

    // Determine if this is a session board based on the URL path
    const isSessionMode = pathname.includes("/board/session/");

    const boardNameFromPath = pathname.split("/")[2];

    const { zoomLevel, handleZoomIn, handleZoomOut, handleFitView } =
      useZoomHandlers(editor);
    useBoardEditor(editor, boardContext, initialBoardId);

    // Pass isSessionMode to useBoardSocket
    useBoardSocket(editor, initialBoardId, false, isSessionMode);

    useDeleteSelectedObject(editor?.canvas);

    useImperativeHandle(ref, () => ({
      updateContent: (content: BoardContent) => {
        if (!editor) return;
        editor.canvas.loadFromJSON(content.canvasData, () => {
          editor.canvas.renderAll();
        });
      },
    }));

    if (!boardContext) return <div>Loading...</div>;

    return (
      <div className='h-screen w-full flex flex-col relative'>
        <style>{animationStyles}</style>
        <FabricHeader
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
        <div className='flex flex-1'>
          <FabricSidebar editor={editor} />
          <div className='flex-1 bg-[#f5f5f5] relative'>
            <FabricJSCanvas className='h-full w-full' onReady={onReady} />
            <CollaboratorAvatars boardId={initialBoardId} />
            <CollaborationToast boardId={initialBoardId} />
            <ZoomPanel
              zoomLevel={zoomLevel}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitView={handleFitView}
            />
          </div>
        </div>
      </div>
    );
  }
);

Board.displayName = "Board";
export default Board;
