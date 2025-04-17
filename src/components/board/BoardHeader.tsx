"use client";
import {
  Box,
  IconButton,
  Typography,
  Button,
  Tooltip,
  Divider,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ShareIcon from "@mui/icons-material/Share";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const BoardHeader = ({ boardName }: { boardName: string }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: "48px", // Toolbar width
        right: 0,
        height: "48px",
        backgroundColor: "#fff",
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        px: 2,
        zIndex: 99,
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="subtitle1" fontWeight="medium">
          {boardName}
        </Typography>
        <IconButton size="small" sx={{ color: "text.secondary" }}>
          <MoreHorizIcon />
        </IconButton>
      </Box>

      <Divider orientation="vertical" sx={{ mx: 2 }} />

      {/* Center Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          size="small"
          sx={{
            textTransform: "none",
            borderColor: "divider",
            color: "text.primary",
          }}
        >
          Share
        </Button>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          size="small"
          sx={{
            textTransform: "none",
            bgcolor: "#2563eb",
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          Present
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* Right Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: 0.5,
          }}
        >
          <Tooltip title="Zoom out">
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <RemoveIcon />
            </IconButton>
          </Tooltip>
          <Typography sx={{ px: 1, userSelect: "none" }}>100%</Typography>
          <Tooltip title="Zoom in">
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title="Enter full screen">
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <FullscreenIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default BoardHeader; 