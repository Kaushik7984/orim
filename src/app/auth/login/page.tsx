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
  IconButton,
  Stack,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft, FaPlus } from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Container
      maxWidth='sm'
      sx={{
        mt: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper elevation={1} sx={{ p: 5, borderRadius: 2, width: "100%" }}>
        <Typography
          variant='h5'
          component='h1'
          gutterBottom
          align='center'
          fontWeight='bold'
        >
          Sign in to Orime
        </Typography>

        <Stack
          direction='row'
          spacing={2}
          justifyContent='center'
          sx={{ mb: 3 }}
        >
          <IconButton size='large' color='default'>
            <HiOutlineShieldCheck />
          </IconButton>
          <IconButton size='large' onClick={handleGoogleSignIn}>
            <FcGoogle />
          </IconButton>
          <IconButton size='large' color='primary'>
            <FaMicrosoft />
          </IconButton>
          <IconButton size='large' color='default'>
            <FaPlus />
          </IconButton>
        </Stack>

        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {error && (
            <Alert severity='error' onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label='Email'
            type='email'
            placeholder='name@company.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label='Password'
            type='password'
            placeholder='••••••••'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type='submit'
            fullWidth
            variant='contained'
            size='large'
            sx={{
              bgcolor: "#2563eb",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            Continue with email
          </Button>
        </Box>

        <Typography variant='body2' align='center' mt={2}>
          <Button
            variant='text'
            onClick={() => router.push("/auth/register")}
            sx={{ textTransform: "none" }}
          >
            Don’t have an account? Sign up
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
}
