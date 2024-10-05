import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const NotificationModal = ({ open, onClose }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/notification/user/${userId}`
        );
        setNotifications(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching notifications");
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedNotification(null);
  };

  const handleAcceptRequest = async () => {
    if (!selectedNotification) return;

    try {
      // Send a POST request to the accept-join endpoint
      await axios.post(`http://localhost:8000/notification/accept-join`, {
        notificationId: selectedNotification._id,
      });

      // Update the local notification list to reflect the acceptance
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === selectedNotification._id
            ? { ...notification, isAccepted: true }
            : notification
        )
      );

      // Close the detail modal after accepting
      handleDetailClose();
    } catch (err) {
      console.error("Error accepting the request:", err);
      setError("Error accepting the request. Please try again.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent style={{ position: "relative", paddingTop: "6px" }}>
          <div
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              aria-label="close"
              style={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h6"
              style={{
                marginLeft: "6px",
                marginBottom: "6px",
                padding: "16px",
              }}
            >
              Notifications
            </Typography>
            <Divider />
          </div>
          <div
            style={{ maxHeight: "400px", overflowY: "auto", padding: "0 6px" }}
          >
            <List>
              {notifications.map((notification, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleNotificationClick(notification)}
                  style={{ cursor: "pointer" }}
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={new Date(
                      notification.created_at
                    ).toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      {selectedNotification && (
        <Dialog
          open={detailOpen}
          onClose={handleDetailClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent style={{ padding: "16px" }}>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleDetailClose}
              aria-label="close"
              style={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              Notification Details
            </Typography>
            <Typography variant="body1">
              <strong>Message:</strong> {selectedNotification.message}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Pod ID:</strong> {selectedNotification.podId}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Status:</strong>{" "}
              {selectedNotification.isAccepted ? "Accepted" : "Pending"}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Created At:</strong>{" "}
              {new Date(selectedNotification.created_at).toLocaleString()}
            </Typography>

            {/* Display Accept button only if the request is pending */}
            {!selectedNotification.isAccepted && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAcceptRequest}
                style={{ marginTop: "16px" }}
              >
                Accept Request
              </Button>
            )}

            <Button
              variant="contained"
              color="secondary"
              onClick={handleDetailClose}
              style={{ marginTop: "16px", marginLeft: "8px" }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default NotificationModal;
