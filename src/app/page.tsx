"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, Box, Typography, Container, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: "80vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #E0EBF5 0%, #B8D4E3 100%)",
  padding: theme.spacing(4),
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-10px)",
  },
}));

export default function Home() {
  const router = useRouter();
  const [boardName, setBoardName] = useState("");

  const handleCreateBoard = () => {
    if (boardName.trim()) {
      router.push(`/board/${boardName}`);
    }
  };

  const features = [
    {
      title: "Real-time Collaboration",
      description: "Draw and create together with your team in real-time",
      icon: "👥",
    },
    {
      title: "Multiple Drawing Tools",
      description: "Use various shapes, pens, and text tools to express your ideas",
      icon: "✏️",
    },
    {
      title: "Instant Sharing",
      description: "Share your boards instantly with a simple link",
      icon: "🔗",
    },
  ];

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: "bold",
              textAlign: "center",
              color: "#1a237e",
            }}
          >
            Welcome to Orim
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              textAlign: "center",
              color: "#455a64",
              mb: 4,
            }}
          >
            Create and collaborate on drawings in real-time
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
              mb: 8,
            }}
          >
            <TextField
              label="Enter board name"
              variant="outlined"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              sx={{ width: { xs: "100%", sm: "300px" } }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateBoard}
              sx={{
                bgcolor: "#1a237e",
                "&:hover": { bgcolor: "#000051" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Create Board
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{ textAlign: "center", mb: 6, color: "#1a237e" }}
        >
          Features
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} elevation={3}>
              <Typography variant="h1" sx={{ mb: 2 }}>
                {feature.icon}
              </Typography>
              <Typography variant="h5" component="h3" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </FeatureCard>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
