"use client";
import DashboardSidebar from "@/components/dashboard/sidebar/DashboardSidebar";
import Header from "@/components/dashboard/header/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Box, Divider } from "@mui/material";

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
      <Box
        sx={{
          width: "270px",
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
        <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.1)" }} />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <DashboardSidebar />
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          marginLeft: "270px",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#ffffff",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Header />
        </Box>

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <ProtectedRoute>{children}</ProtectedRoute>
        </Box>
      </Box>
    </Box>
  );
}
