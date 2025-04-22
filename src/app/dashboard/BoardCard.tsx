import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface BoardCardProps {
  title: string;
  ownerEmail?: string;
  createdAt?: string;
  onClick: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  backgroundImage?: string; // Path to SVG/PNG
  isFavorited?: boolean;
}

const BoardCard: React.FC<BoardCardProps> = ({
  title,
  ownerEmail,
  createdAt,
  onClick,
  onDelete,
  onEdit,
  backgroundImage = "/placeholders/1.svg",
  isFavorited = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card
      onClick={onClick}
      sx={{
        width: 250,
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 2,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box sx={{ position: "relative", height: 120, overflow: "hidden" }}>
        <Image
          src={backgroundImage}
          alt={title}
          fill
          style={{
            // backgroundColor: "#faf9f6db",
            // objectFit: "cover",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />

        <IconButton
          onClick={handleMenuOpen}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            color: "#11100",
            background: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>

      <CardContent sx={{ p: 1.5 }}>
        <Typography variant='body2' fontWeight={500} noWrap>
          {title || "Untitled"}
        </Typography>
        <Typography variant='caption' color='text.secondary' noWrap>
          {ownerEmail ? ownerEmail : "You"},{" "}
          {createdAt
            ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
            : ""}
        </Typography>

        <IconButton sx={{ float: "right", p: 0.5 }}>
          <StarBorderIcon fontSize='small' />
        </IconButton>
      </CardContent>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleMenuClose();
            onEdit?.();
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleMenuClose();
            onDelete();
          }}
          sx={{ color: "red" }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default BoardCard;
