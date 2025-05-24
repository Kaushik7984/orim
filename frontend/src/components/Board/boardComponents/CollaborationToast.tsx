"use client";

import { useAuth } from "@/context/AuthContext";
import { getSocket } from "@/lib/socket";
import { BoardContent } from "@/types";
import { useEffect, useState, useRef } from "react";

export interface BoardRef {
  updateContent: (content: BoardContent) => void;
}

export const CollaborationToast = ({ boardId }: { boardId: string }) => {
  const [notifications, setNotifications] = useState<
    { id: string; message: string; color: string }[]
  >([]);
  const { user } = useAuth();
  const processedEvents = useRef<Set<string>>(new Set());

  const addNotification = (message: string, color: string, eventId: string) => {
    // Check if we've already processed this event
    if (processedEvents.current.has(eventId)) {
      return;
    }

    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, color }]);
    processedEvents.current.add(eventId);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      processedEvents.current.delete(eventId);
    }, 5000);
  };

  useEffect(() => {
    if (!boardId || !user) return;

    const socket = getSocket();
    if (!socket) return;

    const handleUserJoined = ({
      userId,
      username,
    }: {
      userId: string;
      username: string;
    }) => {
      if (userId === user.uid) return;
      const eventId = `join-${userId}-${Date.now()}`;
      addNotification(
        `${username || "Someone"} joined the board`,
        "#27AE60",
        eventId
      );
    };

    const handleUserLeave = ({ userId }: { userId: string }) => {
      const eventId = `leave-${userId}-${Date.now()}`;
      addNotification(`A collaborator left the board`, "#EB5757", eventId);
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
    <div className='fixed top-16 right-4 flex flex-col gap-2 z-20'>
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

export const animationStyles = `
 @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  .animate-slide-in {
    animation: slideIn 0.3s ease-out forwards;
  }
`;
