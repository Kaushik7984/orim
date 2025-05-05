"use client";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import { usePathname, useRouter } from "next/navigation";

const DashboardSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const mainMenuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/dashboard" },
    { text: "Recent", icon: <AccessTimeIcon />, path: "/dashboard/recent" },
    { text: "Starred", icon: <StarBorderIcon />, path: "/dashboard/starred" },
  ];

  const spaces = [
    { text: "My Space", icon: <FolderIcon />, path: "/dashboard/space/1" },
    { text: "Team Space", icon: <FolderIcon />, path: "/dashboard/space/2" },
  ];

  return (
    <Box sx={{ color: "#333333" }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant='subtitle2'
          color='text.secondary'
          sx={{ mb: 1, fontWeight: 500 }}
        >
          MAIN MENU
        </Typography>
        <List disablePadding>
          {mainMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  color: "#333333",
                  "&.Mui-selected": {
                    bgcolor: "rgba(25, 118, 210, 0.08)",
                    color: "#1976d2",
                  },
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.1)" }} />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            variant='subtitle2'
            color='text.secondary'
            sx={{ fontWeight: 500 }}
          >
            SPACES
          </Typography>
          <IconButton size='small' sx={{ color: "text.secondary" }}>
            <AddIcon fontSize='small' />
          </IconButton>
        </Box>
        <List disablePadding>
          {spaces.map((space) => (
            <ListItem key={space.text} disablePadding>
              <ListItemButton
                selected={pathname === space.path}
                onClick={() => router.push(space.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  color: "#333333",
                  "&.Mui-selected": {
                    bgcolor: "rgba(25, 118, 210, 0.08)",
                    color: "#1976d2",
                  },
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                  {space.icon}
                </ListItemIcon>
                <ListItemText primary={space.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default DashboardSidebar;
