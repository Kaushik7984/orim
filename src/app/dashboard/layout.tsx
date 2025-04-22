"use client";
import { Box } from "@mui/material";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Header from "@/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          pt: "56px",
        }}
      >
        <DashboardSidebar />
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            bgcolor: "#faf9f6db",
            minHeight: "100vh",
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
