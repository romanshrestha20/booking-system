import React from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken(); // Clear the token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div>
      <h2>Welcome to the Booking System</h2>
      <p>You are now logged in!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;