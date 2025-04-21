"use client";
import { useEffect, useState } from "react";
import { useBoard } from "@/context/BoardContext/useBoard";
import { useParams, useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import Board from "@/layout/board/Board";

export default function BoardPage() {
  const { id } = useParams();
  const router = useRouter();

  const { loadBoard, currentBoard, loading, error } = useBoard();
  const [hasTried, setHasTried] = useState(false);

  useEffect(() => {
    if (id && !hasTried) {
      loadBoard(id)
        .then(() => setHasTried(true))
        .catch((err) => {
          console.error("Board not found or failed to load:", err);
          // Optional: redirect or show error UI
        });
    }
  }, [id, hasTried]);

  if (loading || !hasTried) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <CircularProgress />
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className='flex justify-center items-center h-screen text-red-500'>
        Board not found.
      </div>
    );
  }

  return <Board boardId={currentBoard._id} />;
}
