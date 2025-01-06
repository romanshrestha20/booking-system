import api from "./api";
import { handleApiError } from "../utils/errorHandler";

/**
 * Create a new booking.
 * @param {Object} bookingData - Data for the new booking.
 * @returns {Promise<Object>} - Created booking object.
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fetch all bookings.
 * @returns {Promise<Array>} - Array of booking objects.
 */
export const getBookings = async () => {
  try {
    const response = await api.get("/bookings");
    return response.data.bookings;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fetch a booking by its ID.
 * @param {string} bookingId - The ID of the booking.
 * @returns {Promise<Object>} - Booking object.
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fetch bookings by user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - Array of booking objects.
 */
export const getBookingsByUserId = async (userId) => {
  try {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data.bookings;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fetch bookings by room ID.
 * @param {string} roomId - The ID of the room.
 * @returns {Promise<Array>} - Array of booking objects.
 */
export const getBookingsByRoomId = async (roomId) => {
  try {
    const response = await api.get(`/bookings/room/${roomId}`);
    return response.data.bookings;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update a booking by its ID.
 * @param {string} bookingId - The ID of the booking to update.
 * @param {Object} bookingData - Updated data for the booking.
 * @returns {Promise<Object>} - Updated booking object.
 */
export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await api.put(`/bookings/${bookingId}`, bookingData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a booking by its ID.
 * @param {string} bookingId - The ID of the booking to delete.
 * @returns {Promise<Object>} - Deletion confirmation.
 */
export const deleteBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};