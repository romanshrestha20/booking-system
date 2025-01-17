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
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome to the Booking System
        </h2>
        {user && (
          <p className="mt-2 text-lg text-gray-600">
            Hello, <strong className="text-blue-600">{user.name}</strong>! You
            are now logged in.
          </p>
        )}
      </header>

      {/* Quick Actions Section */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/my-bookings")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300"
          >
            View Bookings
          </button>
          <button
            onClick={() => navigate("/rooms")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300"
          >
            View Available Rooms
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300"
          >
            My Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300"
          >
            Logout
          </button>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Activity
        </h3>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600">No recent activity.</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;