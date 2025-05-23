"use client";

import Sidebar from "@/components/profile/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Box,
  Container,
  Paper,
  Typography
} from "@mui/material";
import React from "react";
import {
  MdApps,
  MdDashboard,
  MdGroups,
  MdInsights,
  MdPerson,
  MdSecurity,
} from "react-icons/md";

const sidebarItems = [
  { icon: <MdPerson />, label: "Profile", path: "/profile", forceActive: true },
  {
    icon: <MdDashboard />,
    label: "Dashboard",
    path: "/dashboard",
    active: true,
  },
  { icon: <MdInsights />, label: "Insights", path: "/insights", active: false },
  { icon: <MdSecurity />, label: "Security", path: "/security", active: false },
  { icon: <MdApps />, label: "Apps", path: "/apps", active: false },
  { icon: <MdGroups />, label: "Team Profile", path: "/team", active: false },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            bgcolor: "#fff",
            borderBottom: "1px solid #e0e0e0",
            py: 2,
            px: 4,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant='h5' fontWeight='bold'>
            Profile Settings
          </Typography>
        </Box>

        <Container maxWidth='lg' sx={{ mt: 4 }}>
          <Paper elevation={0} sx={{ bgcolor: "#fff" }}>
            <ProtectedRoute>{children}</ProtectedRoute>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
