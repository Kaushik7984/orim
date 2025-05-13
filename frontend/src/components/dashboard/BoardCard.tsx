import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useState } from "react";

interface BoardCardProps {
  title: string;
  ownerEmail?: string;
  createdAt?: string;
  onClick: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  onStar?: () => void;
  backgroundImage?: string;
  isStarred?: boolean;
}

const BoardCard: React.FC<BoardCardProps> = ({
  title,
  ownerEmail,
  createdAt,
  onClick,
  onDelete,
  onEdit,
  onStar,
  backgroundImage = "/placeholders/1.svg",
  isStarred = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMenuInteraction, setIsMenuInteraction] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setIsMenuInteraction(true);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setTimeout(() => setIsMenuInteraction(false), 300);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuInteraction(true);
    handleMenuClose();
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Delete clicked");
    setIsMenuInteraction(true);
    handleMenuClose();
    onDelete();
  };

  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onStar) {
      onStar();
    }
  };

  return (
    <Card
      onClick={(e) => {
        if (anchorEl || isMenuInteraction) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
        onClick();
      }}
      sx={{
        width: "100%",
        height: "100%",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 2,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ position: "relative", height: 140, overflow: "hidden" }}>
        <Image
          src={backgroundImage}
          alt={title}
          fill
          style={{
            objectFit: "fill",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />

        <IconButton
          onClick={handleMenuOpen}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#111000",
            background: "rgba(255, 255, 255, 0.8)",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.95)",
            },
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>

      <CardContent
        sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title || "Untitled"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto",
          }}
        >
          <Tooltip title={ownerEmail || "You"}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                maxWidth: "70%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {ownerEmail ? ownerEmail.split("@")[0] : "You"}
              {createdAt && (
                <span style={{ color: "rgba(0,0,0,0.4)", marginLeft: 4 }}>
                  ·{" "}
                  {formatDistanceToNow(new Date(createdAt), {
                    addSuffix: false,
                  })}
                </span>
              )}
            </Typography>
          </Tooltip>

          <IconButton sx={{ p: 0.5 }} onClick={handleStar}>
            {isStarred ? (
              <StarIcon fontSize="small" sx={{ color: "#FFD700" }} />
            ) : (
              <StarBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            borderRadius: 1,
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {onEdit && <MenuItem onClick={handleRename}>Rename</MenuItem>}
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default BoardCard;
