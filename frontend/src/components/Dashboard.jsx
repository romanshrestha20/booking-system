import React, { use } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

  return (
    <div>
      <h2>Welcome to the Booking System</h2>
          <p>You are now logged in!</p>
          <button onClick={handleLogout}>Logout</button>
          </div>
  );
};
