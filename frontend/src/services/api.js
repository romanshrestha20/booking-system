import axios from 'axios';

const API_BASE_URL = "http://localhost:5001/api";

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Save the token to sessionStorage
export const saveToken = (token) => {
  sessionStorage.setItem("user", JSON.stringify({ token }));
};

// Retrieve the token from sessionStorage
export const getToken = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return user?.token;
};

// Remove the token from sessionStorage (logout)
export const removeToken = () => {
  sessionStorage.removeItem("user");
};

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized errors (e.g., redirect to login)
        removeToken(); // Clear the token
        window.location.href = "/login"; // Redirect to login page
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