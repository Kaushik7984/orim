"use client";
import { Box, Container, Typography, Divider } from "@mui/material";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Image from "next/image";
import Header from "@/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#ffffff",
      }}
    >
      {/* Left Side Navigation - Full Height */}
      <Box
        sx={{
          width: "250px",
          bgcolor: "#ffffff",
          color: "#333333",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          overflow: "hidden",
          zIndex: 100,
          borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.03)",
        }}
      >
        {/* Logo Section */}
        {/* <Box
          sx={{ p: 3, position: "relative", textAlign: "center", zIndex: 1 }}
        >
          <Image
            src='/orim.svg'
            alt='Orim Logo'
            width={100}
            height={40}
            className='filter brightness-0 invert mb-4'
          />
        </Box> */}

        <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.1)" }} />

        {/* Dashboard sidebar with existing functionality */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <DashboardSidebar />
        </Box>
      </Box>

      {/* Right Side Content with Header on top */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: "250px",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#ffffff",
        }}
      >
        {/* Header at the top of right side */}
        <Box sx={{ width: "100%" }}>
          <Header />
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 3, flexGrow: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
}
