// services/api.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Save token and user data to sessionStorage
export const saveToken = (userData) => {
  sessionStorage.setItem("user", JSON.stringify(userData));
};

// Remove token and user data from sessionStorage
export const removeToken = () => {
  sessionStorage.removeItem("user");
};

// Retrieve user data from sessionStorage
export const getUser = () => {
  const user = sessionStorage.getItem("user");
  console.log("User data:", user);
  return user ? JSON.parse(user) : null;
};

// Add request interceptor to include JWT token in headers
api.interceptors.request.use(
  (config) => {
    const user = getUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized errors (e.g., redirect to login)
        removeToken();
        window.location.href = "/login";
      } else if (error.response.status === 404) {
        console.error("Resource not found.");
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      console.error("Network error. Please check your connection.");
    } else {
      console.error("An unexpected error occurred. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default api;