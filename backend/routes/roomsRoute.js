import express from 'express';
import {
    getRoomsController,
    getRoomByIdController,
    createRoomController,
    updateRoomController,
    deleteRoomController,
} from '../controllers/rooms.js';

const router = express.Router();

// Get all rooms
router.get('/', getRoomsController);

// Get a room by ID
router.get('/:room_id', getRoomByIdController);

// Create a new room
router.post('/', createRoomController);

// Update a room by ID
router.put('/:room_id', updateRoomController);

// Delete a room by ID
router.delete('/:room_id', deleteRoomController);

export default router;