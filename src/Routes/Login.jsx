import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userIP, setUserIP] = useState("");
  const navigate = useNavigate();

  // ✅ Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile"); // Redirect to profile if already logged in
    }
  }, [navigate]);

  // ✅ Get User IP Address from External API
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await axios.get("https://api64.ipify.org?format=json");
        setUserIP(response.data.ip);
      } catch (error) {
        console.error("Failed to fetch IP:", error);
      }
    };
    fetchIP();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ✅ 1. Authenticate User
      const authResponse = await axios.post("http://127.0.0.1:8000/auth/login", {
        username_or_email: usernameOrEmail,
        password: password,
      });

      const token = authResponse.data.access_token;
      localStorage.setItem("token", token);

      // ✅ 2. Decode Token (Check Expiry)
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds

      if (decodedToken.exp < currentTime) {
        alert("Session expired, please login again.");
        return;
      }

      // ✅ 3. Get Location Info from IP
      const locationResponse = await axios.get(`https://ipapi.co/${userIP}/json/`);
      const { city, country_name } = locationResponse.data;

      // ✅ 4. Get Device Info
      const deviceType = navigator.userAgent;

      // ✅ 5. Send Login Activity to Backend
      await axios.post("http://127.0.0.1:8000/activity/log-login-activity", {
        username: authResponse.data.user.username,
        email: authResponse.data.user.email,
        ip: userIP,
        city: city || "Unknown",
        country: country_name || "Unknown",
        device_type: deviceType,
      });

      alert("Login successful!");

      // ✅ 6. Redirect to Profile After Login
      navigate("/profile");
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      alert(`Login failed: ${errorMessage}`);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username or Email" 
          value={usernameOrEmail} 
          onChange={(e) => setUsernameOrEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
