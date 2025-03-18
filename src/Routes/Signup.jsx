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

  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

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

  // ✅ Handle Signup & Request OTP
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

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

      setUserEmail(formData.email); // Save user email for OTP verification
      setShowOtpInput(true); // Show OTP input field
      setMessage("An OTP has been sent to your email. Please verify.");
    } catch (error) {
      setError(error.response?.data?.detail || "Signup failed. Please try again.");
    }
  };

  // ✅ Handle OTP Verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/verify-otp",
        { email: userEmail, otp },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data.message);
      navigate("/auth/login"); // Redirect after successful OTP verification
    } catch (error) {
      setError(error.response?.data?.detail || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <h2>{showOtpInput ? "Verify OTP" : "Signup"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {!showOtpInput ? (
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
        // 🔹 OTP Verification Form
        <form onSubmit={handleVerifyOTP}>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
};

export default Signup;
