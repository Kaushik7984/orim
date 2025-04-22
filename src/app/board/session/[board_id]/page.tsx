"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  connectSocket,
  joinBoard,
  onBoardUpdate,
  offBoardUpdate,
} from "@/lib/socket";
import Board from "@/layout/board/Board";
import { BoardContent } from "@/types";

export default function BoardPage({
  params,
}: {
  params: { board_id: string };
}) {
  const { board_id } = params;
  const router = useRouter();

  // Ref to hold a handler for updating board content
  const boardRef = useRef<{
    updateContent: (content: BoardContent) => void;
  }>(null);

  useEffect(() => {
    try {
      connectSocket();
      joinBoard(board_id);

      const handleBoardUpdate = (content: BoardContent) => {
        console.log("Board content updated:", content);
        // Call the board instance to update its content
        boardRef.current?.updateContent(content);
      };

      onBoardUpdate(handleBoardUpdate);

      return () => {
        offBoardUpdate();
      };
    } catch (error) {
      console.error("Error setting up board socket:", error);
      router.push("/dashboard");
    }
  }, [board_id]);

  return (
    <div className='w-full h-full'>
      <Board boardId={board_id} ref={boardRef} />
    </div>
  );
}
