"use client";
import { useAuth } from "@/context/AuthContext";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  styled,
  TextField,
  Toolbar,
  Tooltip
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import HelpMenu from "./header/HelpMenu";
import MoreMenu from "./header/MoreMenu";
import NotificationsMenu from "./header/NotificationsMenu";
import TemplateMenu from "./header/TemplateMenu";
import UserMenu from "./header/UserMenu";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#ffffff",
  color: "#333333",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  position: "static",
  height: "64px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
}));

const StyledSearchInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: 36,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)",
    },
    "& input": {
      padding: "8px 12px",
      color: "#333333",
    },
    "& .MuiInputAdornment-root": {
      color: "rgba(0, 0, 0, 0.5)",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(0, 0, 0, 0.5)",
    opacity: 1,
  },
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>(({ theme, active }) => ({
  color: active ? "#1976d2" : "#555555",
  textTransform: "none",
  fontWeight: active ? 500 : "normal",
  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
  position: "relative",
  "&::after": active
    ? {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "2px",
        backgroundColor: "#1976d2",
      }
    : {},
}));

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Menu anchor states
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const [templateAnchorEl, setTemplateAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [notificationsAnchorEl, setNotificationsAnchorEl] =
    useState<null | HTMLElement>(null);
  const [helpAnchorEl, setHelpAnchorEl] = useState<null | HTMLElement>(null);
  const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);

  const [unreadCount, setUnreadCount] = useState(2);

  const handleSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && searchTerm.trim()) {
        // router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      }
    },
    [searchTerm, router]
  );

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleTemplateMenu = (event: React.MouseEvent<HTMLElement>) => {
    setTemplateAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleHelpMenu = (event: React.MouseEvent<HTMLElement>) => {
    setHelpAnchorEl(event.currentTarget);
  };

  const handleMoreMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
    setUserAnchorEl(null);
  };

  const handleJoinBoard = () => {
    router.push("/board/join-board");
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <StyledAppBar>
      <Toolbar sx={{ minHeight: "64px !important" }}>
        <Box
          component={Link}
          href="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            mr: 3,
          }}
        >
          <Image
            src="/orime.svg"
            alt="Orime Logo"
            width={80}
            height={32}
            className="cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            component={Link}
            href="/dashboard"
            sx={{
              color: isActive("/dashboard") ? "#1976d2" : "#555555",
              textTransform: "none",
              fontWeight: isActive("/dashboard") ? 500 : "normal",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              position: "relative",
              ...(isActive("/dashboard") && {
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  backgroundColor: "#1976d2",
                },
              }),
            }}
          >
            My Boards
          </Button>

          <Button
            onClick={handleTemplateMenu}
            sx={{
              color: isActive("/templates") ? "#1976d2" : "#555555",
              textTransform: "none",
              fontWeight: isActive("/templates") ? 500 : "normal",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
            }}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Templates
          </Button>
          <Button
            onClick={handleMoreMenu}
            sx={{
              color: "#555555",
              textTransform: "none",
              fontWeight: "normal",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
            }}
            endIcon={<MoreHorizIcon />}
          >
            More
          </Button>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user ? (
            <>
              <Button
                onClick={handleJoinBoard}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: "normal",
                  color: "#1976d2",
                  "&:hover": {
                    borderColor: "#1976d2",
                    backgroundColor: "rgba(30, 64, 175, 0.04)",
                  },
                }}
              >
                Join Board
              </Button>
              <Button
                component={Link}
                href="/pricing"
                variant="contained"
                sx={{
                  bgcolor: "#1976d2",
                  color: "white",
                  "&:hover": { bgcolor: "#1e3a8a" },
                  textTransform: "none",
                  fontWeight: "normal",
                }}
              >
                Upgrade
              </Button>
              <Tooltip title="Help & Support">
                <IconButton
                  size="small"
                  sx={{ color: "text.secondary" }}
                  onClick={handleHelpMenu}
                >
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton
                  size="small"
                  sx={{ color: "text.secondary" }}
                  onClick={handleNotificationsMenu}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsNoneIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Profile & Settings">
                <IconButton size="small" onClick={handleUserMenu}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#1e40af",
                      color: "white",
                      fontSize: "0.875rem",
                    }}
                    src={user.photoURL || undefined}
                  >
                    {user.displayName?.charAt(0) || "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <UserMenu
                anchorEl={userAnchorEl}
                onClose={() => setUserAnchorEl(null)}
                user={user}
                onLogout={handleLogout}
              />

              <TemplateMenu
                anchorEl={templateAnchorEl}
                onClose={() => setTemplateAnchorEl(null)}
              />

              <MoreMenu
                anchorEl={moreAnchorEl}
                onClose={() => setMoreAnchorEl(null)}
              />

              <NotificationsMenu
                anchorEl={notificationsAnchorEl}
                onClose={() => setNotificationsAnchorEl(null)}
                onUpdateUnreadCount={setUnreadCount}
              />

              <HelpMenu
                anchorEl={helpAnchorEl}
                onClose={() => setHelpAnchorEl(null)}
              />
            </>
          ) : (
            <>
              <Button
                component={Link}
                href="/auth/login"
                sx={{
                  color: "#555555",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                href="/auth/register"
                variant="contained"
                sx={{
                  bgcolor: "#1e40af",
                  color: "white",
                  "&:hover": { bgcolor: "#1e3a8a" },
                  textTransform: "none",
                  fontWeight: "normal",
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
