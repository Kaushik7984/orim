"use client";
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
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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

  return (
    <StyledAppBar position="fixed">
      <Toolbar sx={{ minHeight: "56px !important" }}>
        {/* Logo Section */}
        <Typography
          variant="h6"
          component={Link}
          href="/"
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
            color="inherit"
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
            color="inherit"
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
          placeholder="Search"
          size="small"
          sx={{ ml: 2, width: 180 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1d4ed8" },
              textTransform: "none",
              fontWeight: "normal",
            }}
          >
            Upgrade
          </Button>
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <HelpOutlineIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton size="small">
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#2563eb",
                fontSize: "0.875rem",
              }}
            >
              KA
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
