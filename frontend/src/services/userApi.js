import { handleApiError } from "../utils/errorHandler";
import api, { saveToken } from "./api"; // Import saveToken

// Login a user and save the token
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    const { token } = response.data; // Extract the token from the response

    // Save the token to sessionStorage
    saveToken(token);

    return response.data; // Return the response data
  } catch (error) {
    throw handleApiError(error); // Throw the error back to the component
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Confirm email with a 6-digit code
export const confirmEmail = async (email, code) => {
  try {
    const response = await api.post("/auth/confirm-email", { email, code });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Resend confirmation email
export const resendConfirmationEmail = async (email) => {
  try {
    const response = await api.post("/auth/resend-email", { email });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post("/auth/reset-password", { email });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Reset password with a token
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to reset password");
  }
};


// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const response = await api.get(`/users/email/${email}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Update user by ID
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Delete user by ID
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};