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
import { useBoard } from "@/context/BoardContext/useBoard";
import Fuse from "fuse.js";

const DashboardSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isOpen, setIsOpen] = useState(false);
  const { boards } = useBoard();
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const fuse = new Fuse(boards, {
    keys: ["title", "ownerEmail", "collaborators"],
    threshold: 0.3,
  });
  const searchResults =
    search && isSearchFocused
      ? fuse.search(search).map((result) => result.item)
      : [];

  const handleMenuClick = (path: string) => {
    router.push(path);
    if (isMobile) setIsOpen(false);
  };

  const commonStyles = {
    icon: {
      minWidth: { xs: 32, sm: 36 },
      color: "#606060",
      "& svg": { fontSize: { xs: 20, sm: 24 } },
    },
    listItem: {
      borderRadius: 1,
      py: { xs: 0.75, sm: 1 },
      "&.Mui-selected": {
        bgcolor: "#f0f0f0",
        "&:hover": { bgcolor: "#f0f0f0" },
      },
    },
    text: {
      fontSize: { xs: "0.85rem", sm: "0.9rem" },
    },
  };

  const SidebarContent = () => (
    <Box
      sx={{
        width: { xs: "100%", sm: "270px" },
        height: "100%",
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          pb: { xs: 1, sm: 1.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              width: { xs: 28, sm: 36 },
              height: { xs: 28, sm: 36 },
              bgcolor: "#D0E8FF",
              color: "#0078D4",
              fontSize: { xs: 14, sm: 16 },
              mr: { xs: 1, sm: 1.5 },
            }}
          >
            SD
          </Avatar>
          <Box sx={{ maxWidth: { xs: 140, sm: 180 }, overflow: "hidden" }}>
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{
                display: "block",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
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
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Software Development
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Search */}
      <Box
        sx={{
          px: { xs: 1.5, sm: 2 },
          mt: { xs: 2, sm: 3 },
          mb: { xs: 1.5, sm: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f5f5f5",
            borderRadius: "4px",
            p: "2px 8px",
          }}
        >
          <SearchIcon sx={{ color: "#757575", fontSize: { xs: 18, sm: 20 } }} />
          <InputBase
            placeholder='Search Board'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            sx={{ ml: 1, flex: 1, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          />
        </Box>
        {search && isSearchFocused && (
          <Box
            sx={{
              mt: 1,
              maxHeight: 200,
              overflowY: "auto",
              bgcolor: "#fafafa",
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            {searchResults.length === 0 ? (
              <Typography sx={{ p: 2, color: "#888", fontSize: "0.9rem" }}>
                No boards found.
              </Typography>
            ) : (
              searchResults.map((board) => (
                <Box
                  key={board._id}
                  sx={{
                    p: 1.2,
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#e3f2fd" },
                  }}
                  onClick={() => router.push(`/board/${board._id}`)}
                >
                  <Typography sx={{ fontWeight: 500, fontSize: "0.95rem" }}>
                    {board.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
                    {board.ownerEmail}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        )}
      </Box>

      {/* Menu Items */}
      <List sx={{ px: { xs: 0.5, sm: 1 } }}>
        {/* Explore */}
        <ListItem disablePadding>
          <ListItemButton
            style={{ cursor: "not-allowed" }}
            sx={{
              ...commonStyles.listItem,
              opacity: 0.6,
            }}
          >
            <ListItemIcon sx={commonStyles.icon}>
              <ExploreOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary='Explore'
              primaryTypographyProps={{
                ...commonStyles.text,
                fontWeight: pathname === "#" ? 500 : 400,
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Home */}
        <ListItem disablePadding>
          <ListItemButton
            selected={pathname === "/dashboard"}
            onClick={() => handleMenuClick("/dashboard")}
            sx={{
              ...commonStyles.listItem,
              cursor: "pointer",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <ListItemIcon sx={commonStyles.icon}>
              <HomeOutlinedIcon fontSize='medium' />
            </ListItemIcon>
            <ListItemText
              primary='Home'
              primaryTypographyProps={{
                ...commonStyles.text,
                fontWeight: pathname === "/dashboard" ? 500 : 400,
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Recent */}
        <ListItem disablePadding>
          <ListItemButton
            style={{ cursor: "not-allowed" }}
            sx={{
              ...commonStyles.listItem,
              opacity: 0.6,
            }}
          >
            <ListItemIcon sx={commonStyles.icon}>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText
              primary='Recent'
              primaryTypographyProps={{
                ...commonStyles.text,
                fontWeight: pathname === "#" ? 500 : 400,
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Starred */}
        <ListItem disablePadding>
          <ListItemButton
            selected={pathname === "/dashboard/starred"}
            onClick={() => handleMenuClick("/dashboard/starred")}
            sx={{
              ...commonStyles.listItem,
              cursor: "pointer",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <ListItemIcon sx={commonStyles.icon}>
              <StarBorderIcon />
            </ListItemIcon>
            <ListItemText
              primary='Starred'
              primaryTypographyProps={{
                ...commonStyles.text,
                fontWeight: pathname === "/dashboard/starred" ? 500 : 400,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ my: { xs: 1, sm: 1.5 } }} />

      {/* Spaces Section */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 0.75, sm: 1 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.8rem" },
            fontWeight: 400,
            color: "#606060",
          }}
        >
          Spaces
        </Typography>
        <IconButton size='small' sx={{ p: { xs: 0.5, sm: 1 } }}>
          <AddIcon
            fontSize='small'
            sx={{
              color: "#606060",
              fontSize: { xs: 18, sm: 20 },
              cursor: "not-allowed",
            }}
          // onClick={() => alert("hello")}

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
            top: { xs: 12, sm: 16 },
            left: { xs: 12, sm: 16 },
            zIndex: 1200,
            bgcolor: "white",
            boxShadow: 1,
            p: { xs: 0.5, sm: 1 },
            "&:hover": { bgcolor: "white" },
          }}
        >
          <MenuIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
        <Drawer
          anchor='left'
          open={isOpen}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: "100%", sm: "270px" },
              boxShadow: "none",
              borderRight: "1px solid #eaeaea",
            },
          }}
        >
          <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
            <IconButton
              onClick={() => setIsOpen(false)}
              size='small'
              sx={{ p: { xs: 0.5, sm: 1 } }}
            >
              <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
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
        display: { xs: "none", md: "block" },
      }}
    >
      <SidebarContent />
    </Box>
  );
};

export default DashboardSidebar;
