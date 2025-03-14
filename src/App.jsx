import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Routes/Signup";
import Login from "./Routes/Login";
import Profile from "./Routes/Profile";
import ResetPassword from "./Routes/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* ✅ Use a dynamic route */}
      </Routes>
    </Router>
  );
}

export default App;
