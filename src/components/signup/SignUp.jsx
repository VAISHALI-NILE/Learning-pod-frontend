import React, { useState } from "react";
import "./SignUp.css";
import { networkRequest } from "../../utils/network_request";
import { apiGeneral } from "../../utils/urls";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    bday: "",
    role: "",
    password: "",
    confPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture") {
      setFormData({ ...formData, profile_picture: files[0] }); // Handle file upload
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const handleResponse = (responseData) => {
        setLoading(false);
        console.log("Response Data:", responseData);
        alert("Sign-up successful");
        navigate("/");
      };

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("first_name", formData.first_name);
      formDataToSubmit.append("last_name", formData.last_name);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("role", formData.role);
      formDataToSubmit.append("password", formData.password);

      await networkRequest(
        apiGeneral.signup,
        handleResponse,
        "post",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Sign-up failed:", error);
      alert("Sign-up failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="form-container">
        <h1 className="title">Sign Up</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group date-role">
            <input
              className="bday"
              type="date"
              name="bday"
              value={formData.bday}
              onChange={handleChange}
              required
            />
            <input
              className="role"
              type="text"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="confPassword"
              placeholder="Re-Enter Password"
              value={formData.confPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button className="sign-up" type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>

          <p className="log-in">
            Already have an account? <a href="/">Log In</a>
          </p>
        </form>
      </div>
    </div>
  );
}
