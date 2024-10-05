// ProfilePopup.js
import React from "react";
import "./ProfilePopup.css"; // Add CSS for styling the popup
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom"; // assuming you're using react-router for navigation

function ProfilePopup({ open, onClose, user }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");

    navigate("/");
  };

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup">
        <h1 className="close-btn" onClick={onClose}>
          ×
        </h1>
        <Avatar src={user.profilePhoto} alt="Pod Profile" />
        <div className="profile-details">
          <p>
            <strong>Name:</strong> {user.fname + " " + user.lname}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
}

export default ProfilePopup;
