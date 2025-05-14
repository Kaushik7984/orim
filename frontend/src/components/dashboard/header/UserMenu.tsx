import { Box, Divider, Menu, MenuItem, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  user: any;
  onLogout: () => Promise<void>;
}

const UserMenu: React.FC<UserMenuProps> = ({
  anchorEl,
  onClose,
  user,
  onLogout,
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await onLogout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
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
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant='subtitle1' fontWeight={500}>
          {user?.displayName || user?.email?.split("@")[0] || "User"}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <MenuItem
        onClick={() => {
          router.push("/profile");
          onClose();
        }}
      >
        My Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          router.push("/dashboard");
          onClose();
        }}
      >
        My Boards
      </MenuItem>
      <MenuItem
        onClick={() => {
          // router.push("/settings");
          onClose();
        }}
      >
        Settings
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
};

export default UserMenu;
