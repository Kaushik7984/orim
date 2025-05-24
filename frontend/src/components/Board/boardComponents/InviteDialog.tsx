import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { boardAPI } from "@/lib/boardApi";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import { useRouter } from "next/navigation";

interface InviteDialogProps {
  boardId: string;
  onClose: () => void;
  isOpen: boolean;
}

export default function InviteDialog({
  boardId,
  onClose,
  isOpen,
}: InviteDialogProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setMessage("");
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      toast.error("You must be logged in to send invitations", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!boardId) {
      setError("Board ID is required");
      return;
    }

    try {
      setIsLoading(true);
      await boardAPI.sendBoardInvite({ email, boardId, message });
      toast.success("Invitation email sent!", {
        duration: 3000,
        position: "top-right",
      });
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to send invitation");
      toast.error("Email send failed. Try again.", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinBoard = () => {
    router.push(`/board/join-board?boardId=${boardId}`);
  };

  const handleCopyBoardId = () => {
    navigator.clipboard.writeText(boardId);
    toast.success("Board ID copied to clipboard!", {
      duration: 2000,
      position: "top-right",
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
      <Paper
        elevation={3}
        className='w-full max-w-md mx-4 bg-white rounded-xl overflow-hidden'
      >
        <div className='p-6'>
          <Typography variant='h6' className='mb-6 font-semibold text-gray-800'>
            Invite to Board
          </Typography>

          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <Typography className='text-red-600 text-sm'>{error}</Typography>
            </div>
          )}

          <Box className='mb-6'>
            <Typography
              variant='subtitle2'
              className='mb-2 text-gray-700 font-medium'
            >
              Board ID:
            </Typography>
            <div className='flex items-center gap-2'>
              <TextField
                fullWidth
                value={boardId}
                InputProps={{
                  readOnly: true,
                  className: "bg-gray-50",
                }}
                variant='outlined'
                size='small'
              />
              <Button
                onClick={handleCopyBoardId}
                variant='contained'
                size='small'
                className='bg-blue-600 hover:bg-blue-700'
              >
                Copy
              </Button>
            </div>
          </Box>

          <Box className='mb-6'>
            <Typography
              variant='subtitle2'
              className='mb-2 text-gray-700 font-medium'
            >
              Share this link to invite others:
            </Typography>
            <Button
              fullWidth
              variant='outlined'
              onClick={handleJoinBoard}
              className='mb-2 border-blue-600 text-blue-600 hover:bg-blue-50'
            >
              Join Board
            </Button>
            <Typography
              variant='caption'
              className='block text-center text-gray-500'
            >
              Or send an email invitation below
            </Typography>
          </Box>

          <form onSubmit={handleInvite} className='space-y-4'>
            <TextField
              fullWidth
              label='Email Address'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size='small'
              className='bg-white'
            />

            <TextField
              fullWidth
              label='Message (Optional)'
              multiline
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              size='small'
              className='bg-white'
            />

            <div className='flex justify-end gap-3 pt-2'>
              <Button
                onClick={onClose}
                variant='outlined'
                disabled={isLoading}
                className='border-gray-300 text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='contained'
                disabled={isLoading}
                className='bg-blue-600 hover:bg-blue-700'
              >
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        </div>
      </Paper>
    </div>
  );
}
