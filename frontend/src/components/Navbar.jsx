import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth to access user and logout

const Navbar = () => {
  const { user, logout } = useAuth(); // Get user and logout function from AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout function
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo or Brand Name */}
          <Link to="/" className="text-xl font-bold">
            Booking System
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            {user ? (
              <>
                {/* Links for authenticated users */}
                <Link
                  to="/"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-bookings"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Bookings
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Links for unauthenticated users */}
                <Link
                  to="/login"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;