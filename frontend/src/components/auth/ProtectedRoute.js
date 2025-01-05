import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import the useAuth hook

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Get the user and loading state from AuthContext

  // Show a loading spinner while checking auth state
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if the user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if the user is authenticated
  return children;
};

export default ProtectedRoute;
