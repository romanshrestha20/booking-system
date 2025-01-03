import {
  getRoomById,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../models/rooms.js";
import { getBookingsByRoomId } from "../models/bookings.js";
import { validateRoom, validateRoomId } from "../middlewares/validateRoom.js";

// Get all rooms
export const getRoomsController = async (req, res) => {
  try {
    const rooms = await getRooms();
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a room by ID
export const getRoomByIdController = [
  validateRoomId,
  async (req, res) => {
    const room_id = parseInt(req.params.room_id);
    try {
      const room = await getRoomById(room_id);
      if (room) {
        res.json({ message: "Room found", room });
      } else {
        res.status(404).json({ error: "Room not found" });
      }
    } catch (error) {
      console.error("Error fetching room:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  },
];

// Create a new room
export const createRoomController = [
  validateRoom,
  async (req, res) => {
    const room = req.body;
    try {
      const newRoom = await createRoom(room);
      res.status(201).json({ message: "Room created", room: newRoom });
    } catch (error) {
      if (error.message === "Room number already exists") {
        res.status(409).json({ error: error.message });
      } else {
        console.error("Error creating room:", error.message);
        res.status(500).json({ error: "Server error" });
      }
    }
  },
];

// Update a room by ID
export const updateRoomController = [
  validateRoomId,
  validateRoom,
  async (req, res) => {
    const room_id = parseInt(req.params.room_id);
    const room = req.body;
    try {
      const updatedRoom = await updateRoom(room_id, room);
      if (updatedRoom) {
        res.json({ message: "Room updated", room: updatedRoom });
      } else {
        res.status(404).json({ error: "Room not found" });
      }
    } catch (error) {
      console.error("Error updating room:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  },
];

// Delete a room by ID
export const deleteRoomController = [
  validateRoomId,
  async (req, res) => {
    const room_id = parseInt(req.params.room_id);
    try {
      const room = await getRoomById(room_id);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      // Check for active bookings
      const roomBookings = await getBookingsByRoomId(room_id);
      if (roomBookings.length > 0) {
        return res
          .status(400)
          .json({ error: "Room has active bookings and cannot be deleted" });
      }

      await deleteRoom(room_id);
      res.json({ 
        message: `Room ${room.room_number} deleted`, 
      });
    } catch (error) {
      console.error("Error deleting room:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  },
];
