"use client";

import { useBoard } from "@/context/BoardContext/useBoard";
import { CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect } from "react";
import BoardCard from "@/components/Board/BoardCard";
import { Grid } from "@mui/material";

const StarredBoards = () => {
  const {
    boards,
    loading,
    error,
    loadStarredBoards,
    deleteBoard,
    updateBoard,
    toggleStarBoard,
  } = useBoard();

  useEffect(() => {
    loadStarredBoards();
  }, []);

  const handleOpenBoard = (boardId: string) => {
    window.location.href = `/board/${boardId}`;
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard(boardId);
      loadStarredBoards();
    } catch (err) {
      console.error("Failed to delete board:", err);
    }
  };

  const handleRenameBoard = async (boardId: string, currentTitle: string) => {
    const newTitle = prompt("Enter new board name:", currentTitle);
    if (newTitle && newTitle.trim() !== currentTitle) {
      try {
        await updateBoard(boardId, { title: newTitle.trim() });
        loadStarredBoards();
      } catch (err) {
        console.error("Failed to rename board:", err);
        alert("Failed to rename board. Please try again.");
      }
    }
  };

  const handleStarBoard = async (boardId: string) => {
    try {
      await toggleStarBoard(boardId);
      loadStarredBoards();
    } catch (err) {
      console.error("Failed to toggle star:", err);
    }
  };

  const getPlaceholderById = (id: string) => {
    const hash = Array.from(id).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    const index = (hash % 10) + 1;
    return `/placeholders/${index}.svg`;
  };

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
        <Typography variant='h6'>{error}</Typography>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 sm:px-6 py-6 sm:py-10'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4'>
        <Typography variant='h4' fontWeight={400}>
          Starred Boards
        </Typography>
      </div>

      {!boards || boards.length === 0 ? (
        <div className='flex flex-col items-center justify-center text-center py-8 sm:py-12'>
          <Image
            src='/elements.svg'
            alt='No starred boards'
            width={400}
            height={300}
            priority
          />
          <Typography variant='h6' color='textSecondary' className='mt-4'>
            No starred boards yet. Star your favorite boards to see them here!
          </Typography>
        </div>
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {boards.map((board) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={2.4}
              key={board._id}
              sx={{
                display: "flex",
                maxWidth: { lg: "20%", xl: "20%" },
                flexBasis: { lg: "20%", xl: "20%" },
              }}
            >
              <BoardCard
                boardId={board._id}
                title={board.title || "Untitled"}
                ownerEmail={board.ownerEmail}
                ownerId={board.ownerId}
                createdAt={board.createdAt}
                onClick={() => handleOpenBoard(board._id)}
                onDelete={() => handleDeleteBoard(board._id)}
                onEdit={() => handleRenameBoard(board._id, board.title)}
                onStar={() => handleStarBoard(board._id)}
                backgroundImage={getPlaceholderById(board._id)}
                isStarred={board.isStarred}
                collaborators={board.collaborators || []}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default StarredBoards;
