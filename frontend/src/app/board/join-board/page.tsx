"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBoard } from "@/context/BoardContext/useBoard";
import { useAuth } from "@/context/AuthContext";
import { Button, TextField, Typography, CircularProgress } from "@mui/material";
import { toast } from "react-hot-toast";

export default function JoinBoard() {
  const [boardId, setBoardId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addCollaborator } = useBoard();
  const { user } = useAuth();

  // If boardId is provided in URL, use it
  useState(() => {
    const id = searchParams.get("boardId");
    if (id) {
      setBoardId(id);
    }
  });

  const handleJoinBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to join a board");
      return;
    }

    if (!boardId.trim()) {
      toast.error("Please enter a board ID");
      return;
    }

    setLoading(true);
    try {
      await addCollaborator(boardId.trim(), user.uid);
      toast.success("Successfully joined the board!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to join board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <Typography variant='h4' className='text-center font-bold'>
            Join a Board
          </Typography>
          <Typography
            variant='body1'
            className='mt-2 text-center text-gray-600'
          >
            Enter the board ID to join as a collaborator
          </Typography>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleJoinBoard}>
          <div>
            <TextField
              fullWidth
              label='Board ID'
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              disabled={loading}
              className='h-12'
            >
              {loading ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                "Join Board"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
