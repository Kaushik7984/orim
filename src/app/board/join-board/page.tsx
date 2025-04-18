"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";

const JoinBoardPage = () => {
  const [boardId, setBoardId] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (boardId.trim()) {
      router.push(`/board/session/${boardId}`);
    }
  };

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant='h4' component='h1' gutterBottom>
            Join Board
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Enter a board ID to join an existing board or create a new one.
          </Typography>
          <TextField
            fullWidth
            label='Board ID'
            variant='outlined'
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
            placeholder='Enter board ID'
          />
          <Button
            variant='contained'
            size='large'
            onClick={handleJoin}
            disabled={!boardId.trim()}
            sx={{
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            Join Board
          </Button>
          <Typography variant='body2' color='text.secondary' align='center'>
            You will be redirected to the board if it exists, or a new board
            will be created.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default JoinBoardPage;
