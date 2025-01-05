// context/AuthContext.js
import { useState, createContext, useContext } from "react";
import { handleApiError } from "../utils/errorHandler";
import api, { saveToken, removeToken, getUser } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser()); // Initialize user from sessionStorage
  const [loading, setLoading] = useState(false);

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, ...userData } = response.data;
      saveToken({ token, ...userData }); // Save token and user data to sessionStorage
      setUser(userData); // Update user state
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Confirm email
  const confirmEmail = async (email, code) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/confirm-email", { email, code });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Resend confirmation email
  const resendConfirmationEmail = async (email) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/resend-email", { email });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", { email });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    setLoading(true);
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Get user by ID
  const getUserById = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Get user by email
  const getUserByEmail = async (email) => {
    setLoading(true);
    try {
      const response = await api.get(`/users/email/${email}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (userId, userData) => {
    setLoading(true);
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null); // Clear user state
    removeToken(); // Remove token from sessionStorage
  };

  // Value provided by the context
  const value = {
    user,
    loading,
    login,
    register,
    confirmEmail,
    resendConfirmationEmail,
    requestPasswordReset,
    resetPassword,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);