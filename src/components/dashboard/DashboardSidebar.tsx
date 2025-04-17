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
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        height: "calc(100vh - 56px)",
        position: "sticky",
        top: "56px",
        overflow: "auto",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
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
                  "&.Mui-selected": {
                    bgcolor: "action.selected",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            SPACES
          </Typography>
          <IconButton size="small">
            <AddIcon fontSize="small" />
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
                  "&.Mui-selected": {
                    bgcolor: "action.selected",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{space.icon}</ListItemIcon>
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