"use client";

import React, { useEffect, useState } from "react";
import { useBoard } from "@/context/BoardContext/useBoard";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
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

const Dashboard = () => {
  const { boards, loading, error, createBoard, loadBoards } = useBoard();
  const router = useRouter();

  const [creating, setCreating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");

  // useEffect(() => {
  //   loadBoards();
  // }, []);

  const handleCreateBoard = async () => {
    if (!boardTitle.trim()) return;
    if (creating) return; // Prevent multiple clicks

    setCreating(true);
    try {
      const newBoard = await createBoard(boardTitle.trim());
      console.log("Created board from Dashboard:", newBoard);
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
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>My Boards</h1>
        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create New Board
        </Button>
      </div>

      {!boards || boards.length === 0 ? (
        <div className='text-center py-12'>
          <Typography variant='h6' color='textSecondary'>
            No boards yet. Create your first board to get started!
          </Typography>
        </div>
      ) : (
        <Grid container spacing={3}>
          {boards.map((board) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={board._id}>
              <Card
                className='h-full cursor-pointer hover:shadow-lg transition-shadow'
                onClick={() => handleOpenBoard(board._id)}
              >
                <CardContent>
                  <Typography variant='h6' noWrap>
                    {board.title || "Untitled"}
                  </Typography>
                  <Typography color='textSecondary' gutterBottom>
                    Owner: {board.ownerId || "Unknown"}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Created:{" "}
                    {board.createdAt
                      ? new Date(board.createdAt).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </CardContent>
              </Card>
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
    </div>
  );
};

export default Dashboard;
