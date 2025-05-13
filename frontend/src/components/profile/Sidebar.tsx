"use client";

import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
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

const Sidebar = () => {
  return (
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

      {/* Logo */}
      <Box sx={{ mb: 4, position: "relative", textAlign: "center" }}>
        <Image
          src='/orime.svg'
          alt='Orim Logo'
          width={100}
          height={40}
          className='filter brightness-0 invert mb-4'
        />
      </Box>

      <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.2)" }} />

      {/* Sidebar Navigation */}
      <List>
        {sidebarItems.map((item) => {
          const isActive = item.forceActive || item.active;
          const isProfile = item.label === "Profile";

          const content = (
            <ListItem
              key={item.label}
              sx={{
                borderRadius: 1,
                mb: 1,
                bgcolor: isProfile
                  ? "rgba(255, 255, 255, 0.15)"
                  : "transparent",
                opacity: isActive ? 1 : 0.5,
                cursor: isActive ? "pointer" : "not-allowed",
                "&:hover": {
                  bgcolor: isActive
                    ? isProfile
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(255, 255, 255, 0.1)"
                    : "inherit",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: isActive ? "bold" : "normal",
                }}
              />
            </ListItem>
          );

          return isActive ? (
            <Link href={item.path} key={item.label} passHref>
              {content}
            </Link>
          ) : (
            <Box key={item.label}>{content}</Box>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
