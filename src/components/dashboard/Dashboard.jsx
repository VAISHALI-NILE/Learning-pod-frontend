// Dashboard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Card from "./Card";
import PodConfirm from "../pods/PodConfirm";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import { apiGeneral } from "../../utils/urls";
import axios from "axios";
import ExCard from "./ExCard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationModal from "./NotificationModal";
import ProfilePopup from "./ProfilePopup"; // Import ProfilePopup component

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [explorePods, setExplorePods] = useState([]);
  const [userPods, setUserPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // State to manage profile popup
  const [user, setUser] = useState({}); // State to store user details

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePopupClick = () => {
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
  };

  const handleProfileOpen = () => {
    setProfileOpen(true);
  };

  const handleProfileClose = () => {
    setProfileOpen(false);
  };

  const handleConfirm = () => {
    console.log("Confirmed!");
    // Add your confirmation logic here
  };

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUserPods = async () => {
      console.log("Full URL:", `${apiGeneral.userPods}${userId}`);
      try {
        const response = await axios.get(`${apiGeneral.userPods}${userId}`);
        setUserPods(response.data);
      } catch (error) {
        console.error("Error during fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPods();
  }, [userId]);

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/create/get-pods?is_public=true"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setExplorePods(data);
      } catch (error) {
        console.error("Error fetching pods:", error);
      }
    };

    fetchPods();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/login/user/${userId}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <div>
      <div className="dashboard">
        <div className="menu-bar">
          <div></div>
          <div className="menu-right">
            <AddIcon className="menu-item" onClick={handleOpen} />
            <NotificationsIcon
              className="menu-item"
              onClick={handlePopupClick}
            />
            <PersonIcon
              className="menu-item"
              onClick={handleProfileOpen} // Open profile popup
            />
          </div>
        </div>
        <PodConfirm
          open={open}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
        <div className="dashboard-content">
          <div className="greetings">
            <h1>Hello User!</h1>
            <p>Welcome to your learning Pod | keep learning!</p>
          </div>

          <div className="my-pods">
            <h2>My Pods</h2>
            <Link to="/pod" className="view-more">
              View All &gt;
            </Link>
            <div className="pods">
              {loading ? (
                <p>Loading...</p>
              ) : userPods.length > 0 ? (
                userPods
                  .slice(0, 3) // Display a maximum of 3 pods
                  .map((pod) => (
                    <Card
                      key={pod._id}
                      pod={{
                        _id: pod._id,
                        pod_name: pod.pod_name,
                        pod_description: pod.pod_description,
                      }}
                    />
                  ))
              ) : (
                <div className="card-container2">
                  <h3>No Pods Joined</h3>
                  <p className="description">
                    Explore and join some pods to enhance your learning
                    experience!
                  </p>
                  <button onClick={handleOpen}>Join</button>
                </div>
              )}

              {/* Display additional "Join Pod" card if there are less than 3 pods */}
              {userPods.length < 3 && (
                <div className="card-container2">
                  <h3>Join a Pod</h3>
                  <p className="description">
                    Explore more pods to enhance your learning experience!
                  </p>
                  <button onClick={handleOpen}>Join</button>
                </div>
              )}
            </div>
          </div>

          <br />
          <div className="explore-pods">
            <h2>Explore Pods</h2>
            <Link to="/explore" className="view-more">
              Explore All &gt;
            </Link>
            <div className="pods">
              {explorePods.length > 0 ? (
                explorePods.slice(0, 3).map((exPod) => (
                  <ExCard
                    key={exPod._id}
                    pod={{
                      pod_name: exPod.pod_name,
                      pod_description: exPod.pod_description,
                    }}
                  />
                ))
              ) : (
                <p>No pods available to explore</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <NotificationModal open={openPopup} onClose={handlePopupClose} />
      <ProfilePopup
        open={profileOpen}
        onClose={handleProfileClose}
        user={user}
      />
    </div>
  );
}

export default Dashboard;
