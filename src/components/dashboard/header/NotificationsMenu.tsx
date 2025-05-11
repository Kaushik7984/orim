import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  time: string;
}

interface NotificationsMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onUpdateUnreadCount: (count: number) => void;
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({
  anchorEl,
  onClose,
  onUpdateUnreadCount,
}) => {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Board Invitation",
      message: "John invited you to join Project X",
      read: false,
      time: "1h ago",
    },
    {
      id: 2,
      title: "Comment on your task",
      message: "Sarah commented on your task",
      read: false,
      time: "3h ago",
    },
    {
      id: 3,
      title: "Task due tomorrow",
      message: "Your task 'Finalize design' is due tomorrow",
      read: true,
      time: "1d ago",
    },
  ]);

  useEffect(() => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    onUpdateUnreadCount(unreadCount);
  }, [notifications, onUpdateUnreadCount]);

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  return (
    <Popover
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
        sx: { width: 320, maxHeight: 400 },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Notifications</Typography>
        <Button size="small" onClick={handleMarkAllRead}>
          Mark all read
        </Button>
      </Box>
      <Divider />
      <List sx={{ p: 0 }}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <ListItem
              key={notification.id}
              sx={{
                bgcolor: notification.read
                  ? "transparent"
                  : "rgba(30, 64, 175, 0.08)",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
              }}
              secondaryAction={
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              }
            >
              <ListItemText
                primary={notification.title}
                secondary={notification.message}
                primaryTypographyProps={{
                  fontWeight: notification.read ? "normal" : 500,
                  variant: "body1",
                }}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No notifications" />
          </ListItem>
        )}
      </List>
      <Divider />
      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          onClick={() => {
            // router.push("/notifications");
            onClose();
          }}
        >
          View All Notifications
        </Button>
      </Box>
    </Popover>
  );
};

export default NotificationsMenu;
