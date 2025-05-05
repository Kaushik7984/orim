"use client";

import NearMeIcon from "@mui/icons-material/NearMe";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CommentIcon from "@mui/icons-material/Comment";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Avatar,
  Badge,
  Divider,
  Menu,
  MenuItem,
  AvatarGroup,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { Nunito } from "next/font/google";
import { useAuth } from "@/context/AuthContext";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InviteDialog from "@/components/InviteDialog";
import { useRouter } from "next/navigation";
import { useBoard } from "@/context/BoardContext/useBoard";

const nunito = Nunito({
  subsets: ["latin-ext"],
  weight: ["700"],
});

// Dummy members data
const dummyMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    photoURL: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    photoURL: "https://i.pravatar.cc/150?img=2",
  },
  // {
  //   id: 3,
  //   name: "Mike Johnson",
  //   email: "mike@example.com",
  //   photoURL: "https://i.pravatar.cc/150?img=3",
  // },
  // {
  //   id: 4,
  //   name: "Sarah Williams",
  //   email: "sarah@example.com",
  //   photoURL: "https://i.pravatar.cc/150?img=4",
  // },
];

const SubRightHeader = () => {
  const router = useRouter();

  const { currentBoard } = useBoard();
  const { user, logout } = useAuth();
  const [isPresenting, setIsPresenting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [membersAnchorEl, setMembersAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const items = [
    {
      name: "Hide collaborators' cursors",
      icon: <NearMeIcon />,
    },
    {
      name: "Reactions",
      icon: <CelebrationIcon />,
    },
    {
      name: "Comments",
      icon: <CommentIcon />,
    },
  ];

  const handleTogglePresentation = () => {
    setIsPresenting((prev) => !prev);
    if (!isPresenting) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMembersMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMembersAnchorEl(event.currentTarget);
  };

  const handleMembersMenuClose = () => {
    setMembersAnchorEl(null);
  };

  const handleInviteClick = () => {
    setIsInviteDialogOpen(true);
    const shareableLink = `${window.location.origin}/board/session/${boardId}`;
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        alert("Board link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying link: ", err);
      });
    handleMenuClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
    } catch (error) {
      // Handle logout error silently
    }
  };

  const handleLogin = () => {
    router.push("/auth/login");
    handleMenuClose();
  };

  // Exit presentation if user manually exits fullscreen
  useEffect(() => {
    const onFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPresenting(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullScreenChange);
  }, []);

  const boardId = currentBoard?._id || "";

  const shareLink = boardId
    ? `${window.location.origin}/board/session/${boardId}`
    : "";

  return (
    <div
      className='flex flex-row items-center h-12 px-4 bg-white border-b rounded-md mr-2 border-gray-200'
      style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
    >
      {/* Left Section */}
      <div className='flex items-center space-x-2'>
        {items.map((item) => (
          <Tooltip key={item.name} title={item.name}>
            <IconButton
              size='small'
              className='hover:bg-[#dde4fc] transition-colors duration-200'
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </div>

      <Divider orientation='vertical' flexItem className='mx-4' />

      {/* Center Section - Members */}
      <div className='flex items-center'>
        <AvatarGroup
          max={4}
          onClick={handleMembersMenuOpen}
          sx={{
            cursor: "pointer",
            "& .MuiAvatar-root": {
              width: 28,
              height: 28,
              fontSize: "0.875rem",
              border: "2px solid white",
            },
          }}
        >
          {dummyMembers.map((member) => (
            <Tooltip key={member.id} title={member.name}>
              <Avatar src={member.photoURL} alt={member.name}>
                {member.name.charAt(0)}
              </Avatar>
            </Tooltip>
          ))}
        </AvatarGroup>

        {/* Members Menu */}
        <Menu
          anchorEl={membersAnchorEl}
          open={Boolean(membersAnchorEl)}
          onClose={handleMembersMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem sx={{ pointerEvents: "none" }}>
            <div className='font-semibold text-gray-700'>Board Members</div>
          </MenuItem>
          <Divider />
          {dummyMembers.map((member) => (
            <MenuItem key={member.id} sx={{ minWidth: "200px" }}>
              <Avatar
                src={member.photoURL}
                sx={{ width: 24, height: 24, mr: 1 }}
              >
                {member.name.charAt(0)}
              </Avatar>
              <div className='flex flex-col'>
                <div className='text-sm'>{member.name}</div>
                <div className='text-xs text-gray-500'>{member.email}</div>
              </div>
            </MenuItem>
          ))}
        </Menu>
      </div>

      <div className='flex-grow' />

      {/* Right Section */}
      <div className='flex items-center space-x-2'>
        {/* Share Button */}
        <button
          onClick={handleInviteClick}
          className='flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200'
        >
          <ShareIcon className='w-4 h-4 mr-1' />
          Share
        </button>

        {/* Present Button */}
        <button
          onClick={handleTogglePresentation}
          className={`flex items-center px-3 py-1.5 text-sm font-medium ${
            isPresenting
              ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
              : "text-white bg-blue-600 hover:bg-blue-700"
          } rounded-md transition-colors duration-200`}
        >
          <PlayArrowIcon className='w-4 h-4 mr-1' />
          {isPresenting ? "Exit" : "Present"}
        </button>

        {/* User Menu */}
        <div
          className='flex items-center space-x-1 px-1 py-1 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors duration-200'
          onClick={handleMenuOpen}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: user ? "#2563eb" : "#e0e0e0",
              fontSize: "0.875rem",
            }}
            src={(user && user.photoURL) || undefined}
          >
            {user ? user.displayName?.charAt(0) || "U" : <PersonIcon />}
          </Avatar>
          <KeyboardArrowDownIcon className='w-4 h-4 text-gray-500' />
        </div>

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
        >
          {user ? (
            <>
              <MenuItem onClick={handleInviteClick}>
                <PersonAddIcon fontSize='small' className='mr-2' />
                Invite
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize='small' className='mr-2' />
                Logout
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleLogin}>
              <LoginIcon fontSize='small' className='mr-2' />
              Login
            </MenuItem>
          )}
        </Menu>

        {/* Notifications */}
        <IconButton
          size='small'
          className='hover:bg-gray-100 transition-colors duration-200'
        >
          <NotificationsNoneIcon className='w-5 h-5' />
        </IconButton>
      </div>

      <InviteDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        boardId={boardId}
        shareLink={shareLink}
      />
    </div>
  );
};

export default SubRightHeader;
