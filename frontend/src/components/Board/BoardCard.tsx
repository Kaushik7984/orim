import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
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
import { format, isToday, isYesterday } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  MoreVert as MoreVertIconMUI,
  Star as StarIconMUI,
  StarBorder as StarBorderIconMUI,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIconMUI,
  Share as ShareIcon,
} from "@mui/icons-material";
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

  return (
    <Card
      className='h-full w-[210px] cursor-pointer hover:shadow-lg transition-shadow duration-200'
      onClick={onClick}
    >
      <div className='relative h-32'>
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className='object-cover'
        />
      </div>
      <CardContent className='flex flex-col h-[calc(100%-8rem)]'>
        <div className='flex justify-between items-start '>
          <Typography variant='h6' noWrap className='flex-1 max-w-[100px]'>
            {title}
          </Typography>
          <div className='flex items-center'>
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
            <Tooltip title='More options'>
              <IconButton
                onClick={handleMenuOpen}
                size='small'
                aria-controls={open ? "board-menu" : undefined}
                aria-haspopup='true'
                aria-expanded={open ? "true" : undefined}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        {createdAt && (
          <Typography variant='body2' color='textSecondary' className='mt-1'>
            {formatDate(createdAt)} by{" "}
            {isOwner ? "you" : formatEmail(ownerEmail || "")}
          </Typography>
        )}
        {collaborators.length > 0 && (
          <Typography variant='caption' color='textSecondary' className='mt-1'>
            {collaborators.length} collaborator
            {collaborators.length !== 1 ? "s" : ""}
          </Typography>
        )}
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
        {onEdit && <MenuItem onClick={handleRename}>Rename</MenuItem>}
        {isOwner && onManageCollaborators && (
          <MenuItem onClick={handleManageCollaborators}>
            <PeopleIconMUI fontSize='small' className='mr-2' />
            Manage Collaborators
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} className='text-red-500'>
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default BoardCard;
