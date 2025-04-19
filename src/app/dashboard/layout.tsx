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
          pt: "56px", // Height of the header
        }}
      >
        <DashboardSidebar />
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            bgcolor: "#f8fafc",
            minHeight: "100vh",
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
