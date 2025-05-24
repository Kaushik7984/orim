"use client";

import Board from "@/components/Board/Board";
import { getSocket } from "@/lib/socket";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const BoardPage = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const board_id = params.board_id as string;
  const boardRef = useRef<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      router.push("/login");
      return;
    }

    async function initializeBoard() {
      try {
        const socket = getSocket();
        if (!socket) {
          throw new Error("Failed to connect socket");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error initializing board:", error);
        router.push("/dashboard");
      }
    }

    initializeBoard();

    return () => {
      const socket = getSocket();
      if (socket) {
        socket.emit("board:leave", { boardId: board_id });
      }
    };
  }, [board_id, router]);

  // if (loading) {
  //   return (
  //     <div className='h-screen flex items-center justify-center'>
  //       <p>Loading board...</p>
  //     </div>
  //   );
  // }

  return (
    <div className='h-screen'>
      <Board boardId={board_id} ref={boardRef} />
    </div>
  );
};

export default BoardPage;
