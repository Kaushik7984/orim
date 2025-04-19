"use client";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  styled,
  Menu,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAuth } from "@/context/AuthContext";
import InviteDialog from "@/components/InviteDialog";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  color: theme.palette.text.primary,
  boxShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
}));

const StyledSearchInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: 36,
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
    "& input": {
      padding: "8px 12px",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
}));

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      // Handle logout error silently
      console.error("Error logging out:", error);
    }
    handleClose();
  };

  // Use hardcoded board ID for testing
  const boardId = "68025d0cee95404ae666a0f2";

  // Extract boardId from different possible URL patterns
  // let boardId = null;

  // Check for /board/session/[board_id] pattern
  // if (pathname.startsWith("/board/session/")) {
  //   const parts = pathname.split("/");
  //   boardId = parts[3]; // The board_id is at index 3
  // }
  // // Check for /board/[boardId] pattern
  // else if (pathname.startsWith("/board/")) {
  //   const parts = pathname.split("/");
  //   boardId = parts[2]; // The boardId is at index 2
  // }

  // Only show invite button and dialog when we have a valid board ID
  const showInviteButton = boardId && boardId.length > 0;

  return (
    <StyledAppBar position='fixed'>
      <Toolbar sx={{ minHeight: "56px !important" }}>
        {/* Logo Section */}
        <Typography
          variant='h6'
          component={Link}
          href='/'
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            mr: 2,
            fontSize: "1.5rem",
          }}
        >
          Orim
        </Typography>

        {/* Navigation Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            color='inherit'
            sx={{
              textTransform: "none",
              fontWeight: "normal",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
            }}
          >
            Recent
            <KeyboardArrowDownIcon />
          </Button>
          <Button
            color='inherit'
            sx={{
              textTransform: "none",
              fontWeight: "normal",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
            }}
          >
            Templates
            <KeyboardArrowDownIcon />
          </Button>
        </Box>

        {/* Search Section */}
        <StyledSearchInput
          placeholder='Search'
          size='small'
          sx={{ ml: 2, width: 180 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon fontSize='small' />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user ? (
            <>
              {showInviteButton && (
                <Button
                  variant='contained'
                  onClick={() => setIsInviteDialogOpen(true)}
                  sx={{
                    bgcolor: "#fff",
                    color: "#2563eb",
                    "&:hover": { bgcolor: "#f1f1f1" },
                    textTransform: "none",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: 20 }} />
                  Invite
                </Button>
              )}

              {showInviteButton && (
                <InviteDialog
                  isOpen={isInviteDialogOpen}
                  onClose={() => setIsInviteDialogOpen(false)}
                  boardId={boardId}
                />
              )}

              <Button
                variant='contained'
                sx={{
                  bgcolor: "#2563eb",
                  "&:hover": { bgcolor: "#1d4ed8" },
                  textTransform: "none",
                  fontWeight: "normal",
                }}
              >
                Upgrade
              </Button>
              <IconButton size='small' sx={{ color: "text.secondary" }}>
                <HelpOutlineIcon />
              </IconButton>
              <IconButton size='small' sx={{ color: "text.secondary" }}>
                <NotificationsNoneIcon />
              </IconButton>
              <IconButton size='small' onClick={handleMenu}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#2563eb",
                    fontSize: "0.875rem",
                  }}
                  src={user.photoURL || undefined}
                >
                  {user.displayName?.charAt(0) || "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={() => router.push("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color='inherit'
                onClick={() => router.push("/auth/login")}
                sx={{
                  textTransform: "none",
                  fontWeight: "normal",
                }}
              >
                Login
              </Button>
              <Button
                variant='contained'
                onClick={() => router.push("/auth/register")}
                sx={{
                  bgcolor: "#2563eb",
                  "&:hover": { bgcolor: "#1d4ed8" },
                  textTransform: "none",
                  fontWeight: "normal",
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
