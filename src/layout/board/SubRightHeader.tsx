"use client";

import NearMeIcon from "@mui/icons-material/NearMe";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CommentIcon from "@mui/icons-material/Comment";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Avatar, Badge, Divider } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { Nunito } from "next/font/google";
import { BoardContext } from "@/context/BoardContext";
import { useAuth } from "@/context/AuthContext";
import { Bolt } from "@/svgs/index.svg";

const nunito = Nunito({
  subsets: ["latin-ext"],
  weight: ["700"],
});

const SubRightHeader = () => {
  const boardContext = useContext(BoardContext);

  if (!boardContext) {
    throw new Error(
      "BoardContext is null. Ensure the provider is set up correctly."
    );
  }

  const { createBoard } = boardContext;
  const { user } = useAuth();
  const [isPresenting, setIsPresenting] = useState(false);

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

  return (
    <div className='flex flex-row rounded-md bg-white p-1 items-center transition-all overflow-hidden'>
      {items.map((item) => (
        <div
          key={item.name}
          className='p-2 rounded-md hover:bg-[#fed2cf] duration-200 cursor-pointer'
        >
          {item.icon}
        </div>
      ))}

      <Badge badgeContent={<Bolt className='w-3 h-3' />}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#2563eb",
            fontSize: "0.875rem",
          }}
          src={(user && user.photoURL) || undefined}
        >
          {(user && user.displayName?.charAt(0)) || "U"}
        </Avatar>
      </Badge>

      <div className='p-2 rounded-md hover:bg-[#fed2cf] duration-200 cursor-pointer'>
        <NotificationsNoneIcon />
      </div>

      <div className='flex flex-row items-center rounded-md bg-slate-200 py-1 mx-1'>
        <button
          onClick={handleTogglePresentation}
          className={`px-3 text-xs font-semibold cursor-pointer ${nunito.className}`}
        >
          {isPresenting ? "Exit" : "Present"}
        </button>
        <Divider orientation='vertical' flexItem />
        <span className='px-2 cursor-pointer'>
          <KeyboardArrowDownIcon />
        </span>
      </div>

      <button
        onClick={() => createBoard()}
        className={`px-4 py-2 bg-blue-600 text-white text-xs font-semibold mx-1 rounded-md ${nunito.className}`}
      >
        Share
      </button>
    </div>
  );
};

export default SubRightHeader;
