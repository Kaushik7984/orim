"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import Board from "@/layout/board/Board";
import { BoardContent } from "@/types";

const BoardPage = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const board_id = params.board_id as string;
  const boardRef = useRef<any>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      router.push("/login");
      return;
    }

    async function initializeBoard() {
      try {
        // Get the socket and it will auto-connect
        const socket = getSocket();
        if (!socket) {
          throw new Error("Failed to connect socket");
        }

        // For session mode, we just need to make sure a socket connection exists
        // The actual board joining is handled by the useBoardSocket hook
        setLoading(false);
      } catch (error) {
        console.error("Error initializing board:", error);
        router.push("/board");
      }
    }

    initializeBoard();

    // Cleanup function
    return () => {
      const socket = getSocket();
      if (socket) {
        socket.emit("board:leave", { boardId: board_id });
      }
    };
  }, [board_id, router]);

  if (loading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <p>Loading board...</p>
      </div>
    );
  }

  return (
    <div className='h-screen'>
      <Board boardId={board_id} ref={boardRef} />
    </div>
  );
};

export default BoardPage;
