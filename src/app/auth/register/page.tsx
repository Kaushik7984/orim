"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signUp(email, password);
      // router.push("/board/join-board");
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/board/join-board");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Container
      maxWidth='sm'
      sx={{
        // height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 5,
          borderRadius: 2,
          width: "100%",
          boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography
            variant='h5'
            component='h1'
            align='center'
            fontWeight='bold'
            gutterBottom
          >
            Create your account
          </Typography>

          {error && (
            <Alert severity='error' onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <TextField
            label='Email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label='Confirm Password'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
          />

          <Button
            type='submit'
            variant='contained'
            size='large'
            sx={{
              bgcolor: "#2563eb",
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            Sign Up
          </Button>

          <Divider>or</Divider>

          <Button
            variant='outlined'
            size='large'
            startIcon={<FcGoogle size={24} />}
            onClick={handleGoogleSignIn}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: "medium",
              borderColor: "divider",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Continue with Google
          </Button>

          <Typography variant='body2' color='text.secondary' align='center'>
            Already have an account?{" "}
            <Button
              variant='text'
              onClick={() => router.push("/auth/login")}
              sx={{ textTransform: "none" }}
            >
              Sign in
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
