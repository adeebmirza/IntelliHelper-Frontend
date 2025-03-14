import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    gender: "",
    dob: "",
    password: "",
    confirm_password: "",
  });

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ✅ Auto redirect if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile"); // Redirect to profile if already logged in
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle user signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/signup",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data.message);
      navigate("/auth/login"); // Redirect after successful signup
    } catch (error) {
      setError(error.response?.data?.detail || "Signup failed. Please try again.");
    }
  };

  // ✅ Handle Forgot Password (Send Reset Link)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/forgot-password",
        { email: userEmail },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage("A password reset link has been sent to your email.");
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to send reset link. Try again.");
    }
  };

  return (
    <div>
      <h2>{isForgotPassword ? "Forgot Password" : "Signup"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {!isForgotPassword ? (
        // 🔹 Signup Form
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      ) : (
        // 🔹 Forgot Password Form
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
      )}

      {/* 🔹 Forgot Password Button */}
      {!isForgotPassword && (
        <p>
          <button onClick={() => setIsForgotPassword(true)}>Forgot Password?</button>
        </p>
      )}
    </div>
  );
};

export default Signup;
