import React from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import GroupIcon from "@mui/icons-material/Group";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";

interface MoreMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ anchorEl, onClose }) => {
  const router = useRouter();

  // More menu items
  const moreMenuItems = [
    {
      id: 1,
      title: "Recently Viewed",
      icon: <HistoryIcon fontSize='small' />,
      path: "/recently-viewed",
    },
    {
      id: 2,
      title: "Favorites",
      icon: <FavoriteIcon fontSize='small' />,
      path: "/favorites",
    },
    {
      id: 3,
      title: "Starred",
      icon: <StarIcon fontSize='small' />,
      path: "/starred",
    },
    {
      id: 4,
      title: "Teams",
      icon: <GroupIcon fontSize='small' />,
      path: "/teams",
    },
    {
      id: 5,
      title: "Analytics",
      icon: <InsightsIcon fontSize='small' />,
      path: "/analytics",
    },
    {
      id: 6,
      title: "Settings",
      icon: <SettingsIcon fontSize='small' />,
      path: "/settings",
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
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {moreMenuItems.map((item) => (
        <MenuItem key={item.id} onClick={() => handleNavigateToItem(item.path)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
        </MenuItem>
      ))}
    </Menu>
  );
};

export default MoreMenu;
