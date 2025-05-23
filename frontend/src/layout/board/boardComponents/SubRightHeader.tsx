"use client";

import NearMeIcon from "@mui/icons-material/NearMe";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CommentIcon from "@mui/icons-material/Comment";
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
import { useEffect, useState } from "react";
import { Nunito } from "next/font/google";
import { useAuth } from "@/context/AuthContext";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InviteDialog from "@/layout/board/boardComponents/InviteDialog";
import { useRouter } from "next/navigation";
import { useBoard } from "@/context/BoardContext/useBoard";
import { CursorPosition, getUserColor } from "@/utils/collaborationUtils";
import { SocketService } from "@/lib/socket";

type ActiveCollaborator = {
  userId: string;
  username: string;
  color: string;
  lastActive: number;
};

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
  const [collaborators, setCollaborators] = useState<ActiveCollaborator[]>([]);
  const [hideCursors, setHideCursors] = useState(false);

  // Track real-time collaborators
  useEffect(() => {
    if (!user || !currentBoard?._id) return;

    const activeCollaborators = new Map<string, ActiveCollaborator>();

    const cursorMoveListener = SocketService.on(
      "cursor:move",
      (data: CursorPosition) => {
        if (data.userId === user.uid) return;

        activeCollaborators.set(data.userId, {
          userId: data.userId,
          username: data.username || "Anonymous",
          color: data.color || getUserColor(data.userId),
          lastActive: Date.now(),
        });

        updateCollaboratorsList();
      }
    );

    const userLeftListener = SocketService.on(
      "board:user-left",
      (data: { userId: string }) => {
        activeCollaborators.delete(data.userId);
        updateCollaboratorsList();
      }
    );

    const updateCollaboratorsList = () => {
      const activeUsers = Array.from(activeCollaborators.values())
        .filter((c) => c.userId !== user.uid)
        .sort((a, b) => b.lastActive - a.lastActive);

      setCollaborators(activeUsers);
    };

    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      let updated = false;

      activeCollaborators.forEach((collaborator, id) => {
        if (now - collaborator.lastActive > 30000) {
          activeCollaborators.delete(id);
          updated = true;
        }
      });

      if (updated) {
        updateCollaboratorsList();
      }
    }, 10000);

    return () => {
      cursorMoveListener();
      userLeftListener();
      clearInterval(cleanupInterval);
    };
  }, [user, currentBoard]);

  const items = [
    {
      name: hideCursors
        ? "Show collaborators' cursors"
        : "Hide collaborators' cursors",
      icon: hideCursors ? (
        <NearMeOutlinedIcon sx={{ color: "#555" }} />
      ) : (
        <NearMeIcon sx={{ color: "#008000" }} />
      ),
      onClick: () => {
        setHideCursors((prev) => !prev);
        window.dispatchEvent(
          new CustomEvent("toggle-cursors-visibility", {
            detail: { hidden: !hideCursors },
          })
        );
      },
    },
    {
      name: "Reactions",
      icon: <CelebrationIcon />,
      onClick: () => { },
    },
    {
      name: "Comments",
      icon: <CommentIcon />,
      onClick: () => { },
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

  // const handleMembersMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   setMembersAnchorEl(event.currentTarget);
  // };

  // const handleMembersMenuClose = () => {
  //   setMembersAnchorEl(null);
  // };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
    } catch (error) { }
  };

  const handleLogin = () => {
    router.push("/auth/login");
    handleMenuClose();
  };

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

  return (
    <div
      className='flex flex-row items-center h-12 px-0 sm:px-1 md:px-2 lg:px-4 bg-white border-b rounded-md mr-0.5 sm:mr-1 md:mr-2 border-gray-200 shadow-md'
      style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
    >
      <div className='flex items-center space-x-0 sm:space-x-0.5 md:space-x-1 lg:space-x-2'>
        {items.map((item) => (
          <Tooltip key={item.name} title={item.name}>
            <IconButton
              size='small'
              className='hover:bg-[#dde4fc] transition-colors duration-200 p-0.5 sm:p-1 md:p-1.5'
              onClick={item.onClick}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </div>
      <Divider
        orientation='vertical'
        flexItem
        className='mx-0.5 sm:mx-1 md:mx-2 lg:mx-4'
      />
      <div className='flex-grow' />
      <div className='flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 lg:space-x-3 pl-0.5 sm:pl-1 md:pl-2 lg:pl-3'>
        <button
          onClick={() => setIsInviteDialogOpen(true)}
          className='flex items-center px-1.5 sm:px-2 md:px-3 lg:px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm'
        >
          <ShareIcon className='w-3.5 h-3.5 sm:w-4 sm:h-4 md:mr-2' />
          <span className='hidden md:inline'>Share</span>
        </button>

        <button
          onClick={handleTogglePresentation}
          className={`flex items-center px-1.5 sm:px-2 md:px-3 lg:px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 shadow-sm ${isPresenting
              ? "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              : "text-blue-600 bg-white border border-blue-600 hover:bg-blue-50"
            }`}
        >
          <PlayArrowIcon className='w-3.5 h-3.5 sm:w-4 sm:h-4 md:mr-2' />
          <span className='hidden md:inline'>
            {isPresenting ? "Exit" : "Present"}
          </span>
        </button>

        <div
          className='flex items-center space-x-0.5 px-0.5 py-0.5 sm:px-1 sm:py-1 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors duration-200'
          onClick={handleMenuOpen}
        >
          <AvatarGroup
            max={3}
            sx={{
              "& .MuiAvatar-root": {
                width: { xs: 18, sm: 20, md: 24, lg: 28 },
                height: { xs: 18, sm: 20, md: 24, lg: 28 },
                fontSize: {
                  xs: "0.65rem",
                  sm: "0.7rem",
                  md: "0.75rem",
                  lg: "0.875rem",
                },
                border: "2px solid white",
              },
            }}
          >
            {user && (
              <Avatar
                sx={{
                  bgcolor: "#2563eb",
                }}
                src={user.photoURL || undefined}
              >
                {user.email?.charAt(0).toUpperCase() || "?"}
              </Avatar>
            )}
            {collaborators.slice(0, 2).map((collaborator) => (
              <Tooltip key={collaborator.userId} title={collaborator.username}>
                <Avatar
                  sx={{ bgcolor: collaborator.color }}
                  alt={collaborator.username}
                >
                  {collaborator.username.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
          <KeyboardArrowDownIcon className='w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-500' />
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
              <MenuItem sx={{ pointerEvents: "none" }}>
                <div className='font-semibold text-gray-700'>Current User</div>
              </MenuItem>
              <MenuItem>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    mr: 1,
                    bgcolor: "#2563eb",
                  }}
                  src={user.photoURL || undefined}
                >
                  {user.email?.charAt(0).toUpperCase() || "?"}
                </Avatar>
                <div className='flex flex-col'>
                  <div className='text-sm'>{user.email}</div>
                  <div className='text-xs text-gray-500'>You</div>
                </div>
              </MenuItem>
              <Divider />
              <MenuItem sx={{ pointerEvents: "none" }}>
                <div className='font-semibold text-gray-700'>Collaborators</div>
              </MenuItem>
              {collaborators.length > 0 ? (
                collaborators.map((collaborator) => (
                  <MenuItem key={collaborator.userId}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        mr: 1,
                        bgcolor: collaborator.color,
                      }}
                    >
                      {collaborator.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className='flex flex-col'>
                      <div className='text-sm'>{collaborator.username}</div>
                      <div className='text-xs text-gray-500'>
                        Active{" "}
                        {Math.floor(
                          (Date.now() - collaborator.lastActive) / 1000
                        ) < 10
                          ? "now"
                          : "recently"}
                      </div>
                    </div>
                  </MenuItem>
                ))
              ) : (
                <MenuItem sx={{ opacity: 0.7 }}>No collaborators yet</MenuItem>
              )}
              <Divider />
              <MenuItem onClick={() => router.push("/profile")}>
                <PersonIcon fontSize='small' className='mr-2' />
                Profile
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
      </div>

      <InviteDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        boardId={boardId}
      />
    </div>
  );
};

export default SubRightHeader;
