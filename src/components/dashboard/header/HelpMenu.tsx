import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

interface HelpMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const HelpMenu: React.FC<HelpMenuProps> = ({ anchorEl, onClose }) => {
  const router = useRouter();

  const helpItems = [
    {
      text: "Help Center",
      icon: <HelpOutlineIcon fontSize="small" />,
      path: "/help",
    },
    {
      text: "Tutorials",
      icon: <SchoolOutlinedIcon fontSize="small" />,
      path: "/tutorials",
    },
    {
      text: "Community Forum",
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      path: "/community",
    },
    {
      text: "Contact Support",
      icon: <ContactSupportOutlinedIcon fontSize="small" />,
      path: "/support",
    },
  ];

  const feedbackItems = [
    {
      text: "Give Feedback",
      icon: <FeedbackOutlinedIcon fontSize="small" />,
      path: "/feedback",
    },
    {
      text: "Request a Feature",
      icon: <BuildOutlinedIcon fontSize="small" />,
      path: "/feature-request",
    },
  ];

  const handleNavigateToItem = (path: string) => {
    // router.push(path);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: { width: 240 },
      }}
    >
      {helpItems.map((item) => (
        <MenuItem
          key={item.text}
          onClick={() => handleNavigateToItem(item.path)}
          sx={{ py: 1 }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </MenuItem>
      ))}

      <Divider />

      {feedbackItems.map((item) => (
        <MenuItem
          key={item.text}
          onClick={() => handleNavigateToItem(item.path)}
          sx={{ py: 1 }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </MenuItem>
      ))}
    </Menu>
  );
};

export default HelpMenu;
