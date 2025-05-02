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

  const boardRef = useRef<{
    updateContent: (content: BoardContent) => void;
  }>(null);

  useEffect(() => {
    let socketConnected = false;

    try {
      connectSocket();
      socketConnected = true;

      joinBoard(board_id);

      const handleBoardUpdate = (content: BoardContent) => {
        boardRef.current?.updateContent(content);
      };

      onBoardUpdate(handleBoardUpdate);

      return () => {
        if (socketConnected) {
          offBoardUpdate();
        }
      };
    } catch (error) {
      console.error("Failed to initialize board socket:", error);
      router.push("/dashboard");
    }
  }, [board_id, router]);

  return (
    <div className='w-full h-full'>
      <Board boardId={board_id} ref={boardRef} />
    </div>
  );
}
