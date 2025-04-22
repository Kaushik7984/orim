"use client";

import { useEffect, useState } from "react";
import { useBoard } from "@/context/BoardContext/useBoard";
import { useParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import Board from "@/layout/board/Board";

export default function BoardPage() {
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : null;

  const { loadBoard, currentBoard, loading, error } = useBoard();
  const [hasTried, setHasTried] = useState(false);

  useEffect(() => {
    if (id && !hasTried) {
      (async () => {
        try {
          await loadBoard(id);
        } catch (err) {
          console.error("Board not found or failed to load:", err);
        } finally {
          setHasTried(true);
        }
      })();
    }
  }, [id, hasTried, loadBoard]);

  if (loading || !currentBoard) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <CircularProgress />
      </div>
    );
  }

  return <Board boardId={currentBoard._id} />;
}
