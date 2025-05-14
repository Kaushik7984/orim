"use client";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const DashboardSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isOpen, setIsOpen] = useState(false);

  const mainMenuItems = [
    {
      text: "Explore",
      icon: <ExploreOutlinedIcon />,
      path: "#",
    },
    {
      text: "Home",
      icon: <HomeOutlinedIcon fontSize='medium' />,
      path: "/dashboard",
    },
    { text: "Recent", icon: <AccessTimeIcon />, path: "#" },
    { text: "Starred", icon: <StarBorderIcon />, path: "/dashboard/starred" },
  ];

  const handleMenuClick = (path: string) => {
    router.push(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const SidebarContent = () => (
    <Box
      sx={{
        width: "270px",
        height: "100%",
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 2,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#D0E8FF",
              color: "#0078D4",
              fontSize: 14,
              mr: 1.5,
            }}
          >
            SD
          </Avatar>
          <Box sx={{ maxWidth: 160, overflow: "hidden" }}>
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{
                display: "block",
                fontSize: "0.75rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              La Net Team Software Solutions Pvt. LTD.
            </Typography>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "0.95rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Software Development
            </Typography>
          </Box>
        </Box>
        <IconButton size='small'>
          <AddIcon fontSize='small' />
        </IconButton>
      </Box>

      <Box sx={{ px: 2, mt: 3, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f5f5f5",
            borderRadius: "4px",
            p: "2px 8px",
          }}
        >
          <SearchIcon sx={{ color: "#757575", fontSize: 20 }} />
          <InputBase
            placeholder='Search by title or topic'
            sx={{ ml: 1, flex: 1, fontSize: "0.875rem" }}
          />
        </Box>
      </Box>

      <List sx={{ px: 1 }}>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                borderRadius: 1,
                py: 1,
                "&.Mui-selected": {
                  bgcolor: "#f0f0f0",
                  "&:hover": {
                    bgcolor: "#f0f0f0",
                  },
                },
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "#606060" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  fontWeight: pathname === item.path ? 500 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1.5 }} />

      <Box
        sx={{
          px: 3,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{ fontSize: "0.8rem", fontWeight: 400, color: "#606060" }}
        >
          Spaces
        </Typography>
        <IconButton size='small'>
          <AddIcon
            fontSize='small'
            sx={{
              color: "#606060",
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1200,
            bgcolor: "white",
            boxShadow: 1,
            "&:hover": { bgcolor: "white" },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor='left'
          open={isOpen}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            sx: {
              width: "270px",
              boxShadow: "none",
              borderRight: "1px solid #eaeaea",
            },
          }}
        >
          <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
            <IconButton onClick={() => setIsOpen(false)} size='small'>
              <CloseIcon />
            </IconButton>
          </Box>
          <SidebarContent />
        </Drawer>
      </>
    );
  }

  return (
    <Box
      sx={{
        width: "270px",
        borderRight: "1px solid #eaeaea",
        height: "100vh",
        bgcolor: "white",
      }}
    >
      <SidebarContent />
    </Box>
  );
};

export default DashboardSidebar;
