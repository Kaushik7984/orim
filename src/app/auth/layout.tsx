"use client";

import React from "react";
import { Box, Typography, Container } from "@mui/material";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Left Side Brand */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "40%",
          bgcolor: "#1e40af",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          px: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.2,
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <Box sx={{ mb: 3, position: "relative" }}>
          <Image
            src='/orime.svg'
            alt='Orime Logo'
            width={100}
            height={40}
            className='filter brightness-0 invert mb-4'
          />
        </Box>
        <Typography variant='h3' fontWeight='bold' align='center' mb={3}>
          Orime Board
        </Typography>
        <Typography variant='h6' align='center' fontWeight='light'>
          Your collaborative workspace for teams and projects
        </Typography>
      </Box>

      {/* Right Side Auth Form */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Container>
          <Box>{children}</Box>
        </Container>
      </Box>
    </Box>
  );
}
