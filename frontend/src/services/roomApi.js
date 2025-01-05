import api from "./api";
import { handleApiError } from "../utils/errorHandler";

// Get all rooms
export const getRooms = async () => {
  try {
    const response = await api.get("/rooms");
    return response.data.rooms;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get room by ID
export const getRoomById = async (roomId) => {
  try {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Create a new room
export const createRoom = async (roomData) => {
  try {
    const response = await api.post("/rooms", roomData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Update room by ID
export const updateRoom = async (roomId, roomData) => {
  try {
    const response = await api.put(`/rooms/${roomId}`, roomData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Delete room by ID
export const deleteRoom = async (roomId) => {
  try {
    const response = await api.delete(`/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
