"use client";
import React, { useEffect } from "react";
import { useBoard } from "@/context/BoardContext/useBoard";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Dashboard = () => {
  const { boards, loading, error, createBoard, loadBoards } = useBoard();
  const router = useRouter();

  useEffect(() => {
    loadBoards();
  }, []);

  const handleCreateBoard = async () => {
    try {
      const newBoard = await createBoard("Untitled Board");
      router.push(`/board/${newBoard._id}`);
    } catch (err) {
      console.error("Failed to create board:", err);
    }
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
        {error}
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
          onClick={handleCreateBoard}
        >
          Create New Board
        </Button>
      </div>

      <Grid container spacing={3}>
        {boards.map((board) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={board._id}>
            <Card
              className='h-full cursor-pointer hover:shadow-lg transition-shadow'
              onClick={() => router.push(`/board/${board._id}`)}
            >
              <CardContent>
                <Typography variant='h6' component='h2' noWrap>
                  {board.title}
                </Typography>
                <Typography color='textSecondary' gutterBottom>
                  {board.description || "No description"}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Last updated: {new Date(board.updatedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Typography variant='body2' color='textSecondary'>
                  {board.isPublic ? "Public" : "Private"}
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {boards.length === 0 && (
        <div className='text-center py-12'>
          <Typography variant='h6' color='textSecondary'>
            No boards yet. Create your first board to get started!
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
