import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/api";
    
const ProtectedRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login if no token
  }

  return children; // Render the protected component
};

export default ProtectedRoute;
