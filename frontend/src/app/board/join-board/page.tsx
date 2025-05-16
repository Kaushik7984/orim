"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBoard } from "@/context/BoardContext/useBoard";
import { useAuth } from "@/context/AuthContext";
import { Button, TextField, Typography, CircularProgress } from "@mui/material";
import { toast } from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function JoinBoard() {
  const [boardId, setBoardId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addCollaborator } = useBoard();
  const { user } = useAuth();
  const [error, setError] = useState("");

  // If boardId is provided in URL, use it
  useEffect(() => {
    const id = searchParams.get("boardId");
    if (id) {
      setBoardId(id);
    }
  }, [searchParams]);

  interface JoinBoardEvent extends React.FormEvent<HTMLFormElement> {}

  const handleJoinBoard = async (e: JoinBoardEvent): Promise<void> => {
    e.preventDefault();
    if (!boardId.trim()) return;

    try {
      setLoading(true);

      if (!user) {
        toast.error("Please sign in to join a board");
        router.push("/auth/login");
        return;
      }

      // Add the user as a collaborator using their email
      await addCollaborator(boardId.trim(), user.email || "");
      toast.success("Successfully joined board!");
      router.push(`/board/${boardId.trim()}`);
    } catch (error) {
      console.error("Failed to join board:", error);
      setError("Failed to join board. Please try again.");
      toast.error("Failed to join board");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative'>
      {/* Back button positioned at absolute top left */}
      <div className='absolute top-28 left-28 border rounded-lg p-2 bg-white shadow-md'>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToDashboard}
          color='primary'
          size='small'
        >
          Back to Dashboard
        </Button>
      </div>

      <div className='max-w-md mx-auto w-full space-y-8 pt-10'>
        <div className='text-center'>
          <Typography variant='h4' className='font-bold'>
            Join a Board
          </Typography>

          <Typography variant='body1' className='mt-2 text-gray-600'>
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
        {error && (
          <Typography
            variant='body2'
            color='error'
            className='mt-2 text-center'
          >
            {error}
          </Typography>
        )}
      </div>
    </div>
  );
}
