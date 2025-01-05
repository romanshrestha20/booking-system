import { handleApiError } from "../utils/errorHandler";
import api, { saveToken } from "./api";

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    const { token, ...userData } = response.data;
    saveToken({ token, ...userData });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const confirmEmail = async (email, code) => {
  try {
    const response = await api.post("/auth/confirm-email", { email, code });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const resendConfirmationEmail = async (email) => {
  try {
    const response = await api.post("/auth/resend-email", { email });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post("/auth/reset-password", { email });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserByEmail = async (email) => {
  try {
    const response = await api.get(`/users/email/${email}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};