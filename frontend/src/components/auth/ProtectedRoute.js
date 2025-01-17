import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user does not have the required role, redirect to home page
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  // If user is authenticated and has the required role, render the children
  return children;
};

export default ProtectedRoute;