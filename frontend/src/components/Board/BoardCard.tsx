import { useAuth } from "@/context/AuthContext";
import { useBoard } from "@/context/BoardContext/useBoard";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  People as PeopleIconMUI,
  Share as ShareIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Avatar,
  AvatarGroup,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { format, isToday, isYesterday } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface BoardCardProps {
  title: string;
  ownerEmail?: string;
  createdAt?: string;
  onClick: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  onStar?: () => void;
  onManageCollaborators?: () => void;
  backgroundImage?: string;
  isStarred?: boolean;
  ownerId?: string;
  collaborators?: string[];
  boardId: string;
}

const BoardCard: React.FC<BoardCardProps> = ({
  title,
  ownerEmail,
  createdAt,
  onClick,
  onDelete,
  onEdit,
  onStar,
  onManageCollaborators,
  backgroundImage = "/placeholders/1.svg",
  isStarred = false,
  ownerId,
  collaborators = [],
  boardId,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMenuInteraction, setIsMenuInteraction] = useState(false);
  const { user } = useAuth();
  const open = Boolean(anchorEl);
  const isOwner = user?.uid === ownerId;

  const { removeCollaborator } = useBoard();

  const handleRemoveCollaborator = async (collaboratorEmail: string) => {
    try {
      await removeCollaborator(boardId, collaboratorEmail);
      toast.success("Successfully left the board");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Failed to remove collaborator:", error);
      toast.error("Failed to leave the board");
    }
  };

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

  const handleManageCollaborators = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuInteraction(true);
    handleMenuClose();
    if (onManageCollaborators) {
      onManageCollaborators();
    }
  };

  const handleShareBoardId = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuInteraction(true);
    navigator.clipboard.writeText(boardId);
    toast.success("Board ID copied to clipboard!", {
      duration: 2000,
      position: "top-right",
    });
    handleMenuClose();
  };

  const formatEmail = (email: string) => {
    if (!email) return "";
    return email.split("@")[0];
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    if (isToday(dateObj)) {
      return "Today";
    } else if (isYesterday(dateObj)) {
      return "Yesterday";
    } else {
      return format(dateObj, "MMM d");
    }
  };

  // Generate initials for avatar
  const getInitials = (email: string) => {
    if (!email) return "?";
    const username = email.split("@")[0];
    return username.substring(0, 1).toUpperCase();
  };

  return (
    <Card
      className='h-full w-[210px] border  cursor-pointer hover:shadow-lg transition-all duration-200 hover:translate-y-[-3px] rounded-lg overflow-hidden'
      onClick={onClick}
    >
      <div className='relative h-36'>
        <Image src={backgroundImage} alt={title} fill className='object-fill' />

        <div className='absolute top-1 right-1  '>
          {onStar && (
            <Tooltip title={isStarred ? "Unstar" : "Star"}>
              <IconButton onClick={handleStar} size='small' className='mr-1'>
                {isStarred ? (
                  <StarIcon className='text-yellow-500' />
                ) : (
                  <StarBorderIcon />
                )}
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
      <CardContent
        className='flex flex-col h-[calc(100%-128px)] bg-gradient-to-b from-gray-50 to-white'
        sx={{
          padding: "10px",
          "&:last-child": {
            paddingBottom: "5px",
          },
        }}
      >
        <div className='flex justify-between items-start mb-1'>
          <Typography
            variant='subtitle1'
            component='h3'
            className='font-medium text-gray-800 line-clamp-1'
            sx={{ fontSize: "1rem" }}
          >
            {title}
          </Typography>
          <Tooltip title='More options'>
            <IconButton
              onClick={handleMenuOpen}
              size='small'
              aria-controls={open ? "board-menu" : undefined}
              aria-haspopup='true'
              aria-expanded={open ? "true" : undefined}
              className='text-gray-500 hover:bg-gray-100'
              sx={{ padding: "4px" }}
            >
              <MoreVertIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </div>

        {createdAt && (
          <div className='flex items-center text-gray-500 mb-1 relative'>
            {/* <AccessTimeIcon
              fontSize='small'
              className='mr-1'
              sx={{ fontSize: "0.875rem" }}
            /> */}
            <Typography variant='caption' className='text-gray-500'>
              {formatDate(createdAt)} by{" "}
              {isOwner ? "you" : formatEmail(ownerEmail || "")}
            </Typography>
          </div>
        )}

        <div className=' pt-2 border-t border-gray-100'>
          <div className='flex justify-between items-center'>
            <Tooltip
              title={isOwner ? "You" : ownerEmail || ""}
              placement='right'
            >
              <div className='flex items-center'>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: "0.75rem",
                    bgcolor: isOwner ? "primary.main" : "secondary.main",
                  }}
                >
                  {getInitials(ownerEmail || "")}
                </Avatar>
              </div>
            </Tooltip>

            {collaborators && collaborators.length > 0 && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onManageCollaborators?.();
                }}
                className='flex items-center gap-2 cursor-pointer'
              >
                <AvatarGroup
                  max={3}
                  sx={{
                    "& .MuiAvatar-root": {
                      width: 24,
                      height: 24,
                      fontSize: "0.75rem",
                      border: "2px solid white",
                    },
                  }}
                >
                  {collaborators.map((collaborator) => (
                    <Avatar
                      key={collaborator}
                      sx={{ bgcolor: "secondary.main" }}
                    >
                      {collaborator.charAt(0).toUpperCase()}
                    </Avatar>
                  ))}
                </AvatarGroup>

                <Chip
                  icon={
                    <PeopleIconMUI sx={{ fontSize: "0.875rem !important" }} />
                  }
                  label={collaborators.length}
                  size='small'
                  variant='outlined'
                  className='h-6'
                  sx={{
                    "& .MuiChip-label": {
                      padding: "0 4px",
                      fontSize: "0.7rem",
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <Menu
        id='board-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleShareBoardId}>
          <ShareIcon fontSize='small' className='mr-2' />
          Share Board ID
        </MenuItem>
        {onEdit && (
          <MenuItem onClick={handleRename}>
            <EditIcon fontSize='small' className='mr-2' />
            Rename
          </MenuItem>
        )}
        {isOwner && onManageCollaborators && (
          <MenuItem onClick={handleManageCollaborators}>
            <PeopleIconMUI fontSize='small' className='mr-2' />
            Manage Collaborators
          </MenuItem>
        )}
        {isOwner ? (
          <MenuItem onClick={handleDelete} className='text-red-500'>
            <DeleteIcon fontSize='small' className='mr-2' />
            Delete
          </MenuItem>
        ) : (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClose();
              handleRemoveCollaborator(user?.email || "");
            }}
            className='text-red-500'
          >
            <ExitToAppIcon fontSize='small' className='mr-2' />
            Leave Board
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default BoardCard;
