"use client";
import { useAuth } from "@/context/AuthContext";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  styled,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#ffffff",
  color: "#333333",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  position: "static",
  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
  "& .MuiToolbar-root": {
    minHeight: { xs: "56px !important", sm: "64px !important" },
  },
});

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
    handleMenuClose();
  };

  const handleJoinBoard = () => {
    router.push("/board/join-board");
  };

  return (
    <StyledAppBar>
      <Toolbar
        sx={{
          minHeight: { xs: "56px !important", sm: "64px !important" },
          px: { xs: 1, sm: 2, md: 3 },
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Box
          component={Link}
          href='/'
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            mr: { xs: 0, sm: 2, md: 3 },
          }}
        >
          <Image
            src='/orime.svg'
            alt='Orime Logo'
            width={80}
            height={32}
            priority
            className='cursor-pointer hover:opacity-90 transition-opacity'
            style={{ width: "auto", height: "24px" }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          {user ? (
            <>
              <Button
                onClick={handleJoinBoard}
                variant='outlined'
                sx={{
                  textTransform: "none",
                  fontWeight: "normal",
                  color: "#1976d2",
                  // fontSize: { xs: "0.875rem", sm: "1rem" },
                  "&:hover": {
                    borderColor: "#1976d2",
                    backgroundColor: "rgba(30, 64, 175, 0.04)",
                  },
                }}
              >
                Join Board
              </Button>

              <Button
                variant='outlined'
                sx={{
                  textTransform: "none",
                  opacity: "0.6",
                  cursor: "not-allowed",
                }}
              >
                Upgrade
              </Button>

              <Tooltip title='Account'>
                <IconButton
                  onClick={handleMenuOpen}
                // sx={{
                //   p: { xs: 0.5, sm: 1 },
                //   ml: { xs: 0.5, sm: 1 },
                //   border: "2px solid transparent",
                //   "&:hover": {
                //     borderColor: "#1976d2",
                //   },
                // }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: user ? "#2563eb" : "#e0e0e0",
                      fontSize: "0.875rem",
                    }}
                    src={(user && user.photoURL) || undefined}
                  >
                    {(user && user.email?.charAt(0).toUpperCase()) || "?"}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    borderRadius: "8px",
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant='subtitle1' fontWeight={500}>
                    {user?.displayName || user?.email?.split("@")[0] || "User"}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {user?.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem
                  onClick={() => {
                    router.push("/profile");
                    handleMenuClose();
                  }}
                  sx={{ py: 1 }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push("/dashboard");
                    handleMenuClose();
                  }}
                  sx={{ py: 1 }}
                >
                  My Boards
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={handleLogout}
                  sx={{ py: 1, color: "#ef4444" }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              href='/auth/login'
              variant='contained'
              sx={{
                bgcolor: "#1976d2",
                color: "white",
                "&:hover": { bgcolor: "#1976dd" },
                textTransform: "none",
                fontWeight: "normal",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
