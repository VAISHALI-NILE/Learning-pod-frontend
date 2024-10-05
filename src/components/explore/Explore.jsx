import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import "./Explore.css";

const Explore = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedPod, setSelectedPod] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [pods, setPods] = useState([]);

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
        setPods(data);
      } catch (error) {
        console.error("Error fetching pods:", error);
      }
    };

    fetchPods();
  }, []);

  const handleOpenPopup = (pod) => {
    setSelectedPod(pod);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedPod(null);
    setRequestMessage("");
  };

  const handleSendRequest = () => {
    alert(
      `Request sent to join "${selectedPod.name}" pod with message: "${requestMessage}"`
    );
    handleClosePopup();
  };

  return (
    <div className="explore-container">
      <h2>Explore Pods</h2>
      <div className="pods-grid">
        {pods.map((pod) => (
          <div className="pod-card" key={pod.id}>
            <h3>{pod.pod_name}</h3>
            <p className="description">{pod.pod_description}</p>
            <button
              style={{ backgroundColor: "#508C9B" }}
              onClick={() => handleOpenPopup(pod)}
            >
              Join Pod
            </button>
          </div>
        ))}
      </div>

      {/* Modal for joining request */}
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Join {selectedPod?.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            variant="outlined"
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendRequest} color="primary">
            Request
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Explore;
