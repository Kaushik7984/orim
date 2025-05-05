"use client";

import React, { useEffect, useState } from "react";
import { useBoard } from "@/context/BoardContext/useBoard";
import { useRouter } from "next/navigation";
import {
  Button,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BoardCard from "./BoardCard";
import Image from "next/image";

const Dashboard = () => {
  const {
    boards,
    loading,
    error,
    createBoard,
    loadBoards,
    deleteBoard,
    updateBoard,
  } = useBoard();
  const router = useRouter();

  const [creating, setCreating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  useEffect(() => {
    loadBoards();
  }, []);

  const handleCreateBoard = async () => {
    if (!boardTitle.trim() || creating) return;

    setCreating(true);
    try {
      const newBoard = await createBoard(boardTitle.trim());
      setOpenDialog(false);
      setBoardTitle("");
      router.push(`/board/${newBoard._id}`);
    } catch (err) {
      console.error("Failed to create board:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenBoard = (boardId: string) => {
    router.push(`/board/${boardId}`);
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard(boardId);
      loadBoards();
    } catch (err) {
      console.error("Failed to delete board:", err);
    }
  };

  const handleRenameBoard = (boardId: string, currentTitle: string) => {
    setRenameTitle(currentTitle);
    setSelectedBoardId(boardId);
    setRenameDialogOpen(true);
  };

  const confirmRename = async () => {
    if (!selectedBoardId || !renameTitle.trim()) return;

    try {
      const response = await updateBoard(selectedBoardId, {
        title: renameTitle.trim(),
      });
      console.log("Update response:", response);
      setRenameDialogOpen(false);
      await loadBoards();
    } catch (err) {
      console.error("Failed to rename board:", err);
      alert("Failed to rename board. Please try again.");
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
        <Typography variant='h4' fontWeight={700}>
          My Boards
        </Typography>
        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ borderRadius: "12px", textTransform: "none" }}
        >
          Create Board
        </Button>
      </div>

      {!boards || boards.length === 0 ? (
        <div className='flex flex-col items-center justify-center text-center py-8 sm:py-12'>
          <Image
            src='/elements.svg'
            alt='No boards'
            width={400}
            height={300}
            priority
          />
          <Typography variant='h6' color='textSecondary' className='mt-4'>
            No boards yet. Create your first board to get started!
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
                title={board.title || "Untitled"}
                ownerEmail={board.ownerEmail}
                createdAt={board.createdAt}
                onClick={() => handleOpenBoard(board._id)}
                onDelete={() => handleDeleteBoard(board._id)}
                onEdit={() => handleRenameBoard(board._id, board.title)}
                backgroundImage={getPlaceholderById(board._id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Board Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Board</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Board Name'
            type='text'
            fullWidth
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateBoard} disabled={creating}>
            {creating ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Board Dialog */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
      >
        <DialogTitle>Rename Board</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='New Board Name'
            type='text'
            fullWidth
            value={renameTitle}
            onChange={(e) => setRenameTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmRename} disabled={!renameTitle.trim()}>
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
