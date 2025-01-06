// services/roomApi.js
import api from "./api";
import { handleApiError } from "../utils/errorHandler";

/**
 * Fetch all rooms.
 * @returns {Promise<Array>} - Array of room objects.
 */
export const getRooms = async () => {
  try {
    const response = await api.get("/rooms");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fetch a room by its ID.
 * @param {string} roomId - The ID of the room.
 * @returns {Promise<Object>} - Room object.
 */
export const getRoomById = async (roomId) => {
  try {
    const response = await api.get(`/rooms/${roomId}`); // Make API call
    return response.data; // Return room data
  } catch (error) {
    throw handleApiError(error); // Handle API errors
  }
};

/**
 * Create a new room.
 * @param {Object} roomData - Data for the new room.
 * @returns {Promise<Object>} - Created room object.
 */
export const createRoom = async (roomData) => {
  try {
    const response = await api.post("/rooms", roomData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update a room by its ID.
 * @param {string} roomId - The ID of the room to update.
 * @param {Object} roomData - Updated data for the room.
 * @returns {Promise<Object>} - Updated room object.
 */
export const updateRoom = async (roomId, roomData) => {
  try {
    const response = await api.put(`/rooms/${roomId}`, roomData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a room by its ID.
 * @param {string} roomId - The ID of the room to delete.
 * @returns {Promise<Object>} - Deletion confirmation.
 */
export const deleteRoom = async (roomId) => {
  try {
    const response = await api.delete(`/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
