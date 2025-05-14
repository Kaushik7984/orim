"use client";
import DashboardSidebar from "@/components/dashboard/sidebar/DashboardSidebar";
import Header from "@/components/dashboard/header/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Box, useMediaQuery, useTheme } from "@mui/material";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#ffffff",
      }}
    >
      {!isMobile && (
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
          <DashboardSidebar />
        </Box>
      )}

      <Box
        sx={{
          flexGrow: 1,
          marginLeft: { xs: 0, md: "270px" },
          display: "flex",
          flexDirection: "column",
          bgcolor: "#ffffff",
          width: { xs: "100%", md: "calc(100% - 270px)" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            position: "sticky",
            top: 0,
            zIndex: 99,
            bgcolor: "#ffffff",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <Header />
        </Box>

        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            flexGrow: 1,
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <ProtectedRoute>{children}</ProtectedRoute>
        </Box>
      </Box>

      {isMobile && <DashboardSidebar />}
    </Box>
  );
}
