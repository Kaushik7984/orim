"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useBoard } from "@/context/BoardContext";
import Board from "@/layout/board/Board";
import { CircularProgress } from "@mui/material";

const BoardPage = () => {
  const { id } = useParams();
  const { loadBoard, currentBoard, loading, error } = useBoard();

  useEffect(() => {
    if (id) {
      loadBoard(id as string);
    }
  }, [id, loadBoard]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen text-red-500'>
        {error}
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className='flex items-center justify-center h-screen'>
        Board not found
      </div>
    );
  }

  return <Board boardId={currentBoard.id} />;
};

export default BoardPage;
