import React from "react";
import "./Card.css";
import { useNavigate } from "react-router-dom";

function Card({ pod }) {
  const navigate = useNavigate();
  if (!pod || !pod.pod_name || !pod.pod_description) {
    return <div className="error">Invalid pod data</div>; // Handle invalid pod data
  }
  const handleOpen = (pod) => {
    navigate("/pod");
  };
  return (
    <div className="card-container">
      <h3>{pod.pod_name}</h3>
      <p className="description">{pod.pod_description}</p>
      <button
        style={{ backgroundColor: "#508C9B" }}
        onClick={() => handleOpen(pod)}
      >
        Open
      </button>
    </div>
  );
}

export default Card;
