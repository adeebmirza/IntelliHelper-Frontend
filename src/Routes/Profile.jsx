import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// Import jwt-decode to check token expiration

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    gender: "",
    dob: "",
    current_password: "",
    new_password: "",
  });

  const navigate = useNavigate();

  // ✅ Check if the token is expired before fetching profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      navigate("/auth/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds

      if (decodedToken.exp < currentTime) {
        // Token is expired
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }
    } catch (err) {
      setError("Invalid token. Please log in again.");
      localStorage.removeItem("token");
      navigate("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
        setFormData({
          name: response.data.name,
          username: response.data.username,
          gender: response.data.gender,
          dob: response.data.dob,
          current_password: "",
          new_password: "",
        });
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const updateData = {
        name: formData.name,
        username: formData.username,
        gender: formData.gender,
        dob: formData.dob,
      };

      // Include password fields only if the user fills them
      if (formData.current_password && formData.new_password) {
        updateData.current_password = formData.current_password;
        updateData.new_password = formData.new_password;
      }

      const response = await axios.put("http://127.0.0.1:8000/profile/update", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message);
      setProfile((prevProfile) => ({ ...prevProfile, ...updateData }));
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    navigate("/auth/login");
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <img 
        src={profile.profile_picture} 
        alt="Profile" 
        width="100" 
        height="100" 
        style={{ borderRadius: "50%" }}
      />

      {editing ? (
        <form onSubmit={handleUpdate}>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />

          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Date of Birth:</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

          <hr />

          <h3>Change Password (Optional)</h3>
          <label>Current Password:</label>
          <input type="password" name="current_password" value={formData.current_password} onChange={handleChange} />

          <label>New Password:</label>
          <input type="password" name="new_password" value={formData.new_password} onChange={handleChange} />

          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <p><strong>Date of Birth:</strong> {profile.dob}</p>

          <button onClick={() => setEditing(true)}>Edit Profile</button>
          <button onClick={handleLogout} style={{ marginLeft: "10px", color: "red" }}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
