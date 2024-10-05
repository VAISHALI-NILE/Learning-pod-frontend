import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { apiGeneral } from "../../utils/urls";
import { useNavigate } from "react-router-dom";

const Container = styled(Box)(() => ({
  maxWidth: "600px",
  margin: "auto",
  marginTop: "20px",
  padding: "24px",
  borderRadius: "8px",
  backgroundColor: "white",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
}));

const Title = styled(Typography)(() => ({
  marginBottom: "24px",
  fontWeight: "bold",
  fontSize: "1.5rem",
  textAlign: "center",
}));

const OptionButton = styled(Button)(() => ({
  marginTop: "16px",
  width: "100%",
  backgroundColor: "#2d3e54",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#1a2633",
  },
}));

function CreatePod() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("user_id");
  const [userRole, setRole] = useState("");
  const navigate = useNavigate();

  async function fetchUserRole(userId) {
    try {
      const response = await axios.get(
        `${apiGeneral.createPod}/user-role/${userId}`
      );
      return response.data.role;
    } catch (error) {
      console.error("Error fetching user role:", error);
      throw error;
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      fetchUserRole(userId).then((role) => {
        setRole(role);
      });
      const response = await axios.post(
        apiGeneral.createPod,
        {
          pod_name: name,
          pod_description: description,
          is_public: privacy === "public",
          created_by: userId,
          members: [{ user_id: userId, role: userRole }],
          resources: [],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("access_token") || "",
          },
        }
      );
      if (response) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(
        "Error creating pod:",
        error.response ? error.response.data : error.message
      );
      setError("Error creating pod. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Create New Pod</Title>
      <TextField
        label="Pod Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Privacy</InputLabel>
        <Select
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
          label="Privacy"
        >
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="private">Private</MenuItem>
        </Select>
      </FormControl>
      {error && (
        <Typography color="error" align="center" margin="16px 0">
          {error}
        </Typography>
      )}
      <OptionButton
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Pod"}
      </OptionButton>
    </Container>
  );
}

export default CreatePod;
