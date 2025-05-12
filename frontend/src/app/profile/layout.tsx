"use client";

import {
  Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import {
  MdApps,
  MdGroups,
  MdInsights,
  MdPerson,
  MdSecurity,
} from "react-icons/md";

const sidebarItems = [
  { icon: <MdPerson />, label: "Users" },
  { icon: <MdInsights />, label: "Insights" },
  { icon: <MdSecurity />, label: "Security" },
  { icon: <MdApps />, label: "Apps" },
  { icon: <MdGroups />, label: "Team Profile" },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Box
        sx={{
          width: "250px",
          bgcolor: "#1e40af",
          color: "white",
          p: 3,
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

        <Box sx={{ mb: 4, position: "relative", textAlign: "center" }}>
          <Image
            src="/orime.svg"
            alt="Orim Logo"
            width={100}
            height={40}
            className="filter brightness-0 invert mb-4"
          />
        </Box>

        <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.2)" }} />

        <List>
          {sidebarItems.map((item) => (
            <ListItem
              button
              key={item.label}
              sx={{
                borderRadius: 1,
                mb: 1,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: 14 }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

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
          <Typography variant="h5" fontWeight="bold">
            Profile Settings
          </Typography>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Paper elevation={0} sx={{ bgcolor: "#fff" }}>
            {children}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
