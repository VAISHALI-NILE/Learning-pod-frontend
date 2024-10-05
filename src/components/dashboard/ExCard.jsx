import React, { useState } from "react";
import "./Card.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

function ExCard({ pod }) {
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedPod, setSelectedPod] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  if (!pod || !pod.pod_name || !pod.pod_description) {
    return <div className="error">Invalid pod data</div>; // Handle invalid pod data
  }
  const handleOpen = (pod) => {
    // Add any additional logic to handle the pod object when the card is clicked
  };
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
    <div>
      <div className="card-container">
        <h3>{pod.pod_name}</h3>
        <p className="description">{pod.pod_description}</p>
        <button
          style={{ backgroundColor: "#508C9B" }}
          onClick={() => handleOpenPopup(pod)}
        >
          Join
        </button>
      </div>

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
}

export default ExCard;
