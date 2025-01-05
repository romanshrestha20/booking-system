import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth to access logout and user data

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Use useAuth to get the logout function and user data

  const handleLogout = () => {
    logout(); // Call logout function from AuthContext
    navigate("/login"); // Redirect to login page
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>Welcome to the Booking System</h2>
      {user && (
        <p>
          Hello, <strong>{user.name}</strong>! You are now logged in.
        </p>
      )}
      <div style={{ marginTop: "20px" }}>
        <h3>Quick Actions</h3>
        <button
          onClick={() => navigate("/bookings")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          View Bookings
        </button>
        <button
          onClick={() => navigate("/profile")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          My Profile
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3>Recent Activity</h3>
        <p>No recent activity.</p>
      </div>
    </div>
  );
};

export default Dashboard;