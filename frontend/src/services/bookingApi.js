import api from "./api";
import {handleApiError } from "../utils/errorHandler";

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
        throw handleApiError(error);
(error);
  }
};

// Get all bookings
export const getBookings = async () => {
  try {
    const response = await api.get("/bookings");
    return response.data.bookings;
  } catch (error) {
        throw handleApiError(error);
(error);
  }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
        throw handleApiError(error);
(error);
  }
};

// Get bookings by user ID
export const getBookingsByUserId = async (userId) => {
  try {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data.bookings;
  } catch (error) {
        throw handleApiError(error);
(error);
  }
};

// Get bookings by room ID
export const getBookingsByRoomId = async (roomId) => {
  try {
    const response = await api.get(`/bookings/room/${roomId}`);
    return response.data.bookings;
  } catch (error) {
        throw handleApiError(error);
(error);
  }
};


// Update booking by ID
export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await api.put(`/bookings/${bookingId}`, bookingData);
    return response.data;
  } catch (error) {
        throw handleApiError(error);
(error);
  }
};

// Delete booking by ID
export const deleteBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
        throw handleApiError(error);
(error);
  }
};