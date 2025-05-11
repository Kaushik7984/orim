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
  InputBase,
  Avatar,
  Tooltip,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import { usePathname, useRouter } from "next/navigation";

const DashboardSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const mainMenuItems = [
    {
      text: "Explore",
      icon: <ExploreOutlinedIcon />,
      path: "/dashboard/explore",
    },
    {
      text: "Home",
      icon: <HomeOutlinedIcon fontSize='medium' />,
      path: "/dashboard",
    },
    { text: "Recent", icon: <AccessTimeIcon />, path: "/dashboard/recent" },
    { text: "Starred", icon: <StarBorderIcon />, path: "/dashboard/starred" },
  ];

  return (
    <Box
      sx={{
        width: "270px",
        borderRight: "1px solid #eaeaea",
        height: "100vh",
        bgcolor: "white",
      }}
    >
      {/* Software Development header */}
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
      {/* <Divider /> */}

      {/* Search field */}
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

      {/* Main menu items */}
      <List sx={{ px: 1 }}>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
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

      {/* Spaces section */}
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
};

export default DashboardSidebar;