import { validationResult, check } from "express-validator";

// Middleware to validate room data
export const validateRoom = [
  check("room_number")
    .exists().withMessage("Room number is required")
    .isString().withMessage("Room number must be a string"),
  check("type")
    .exists().withMessage("Type is required")
    .isString().withMessage("Type must be a string"),
  check("price")
    .exists().withMessage("Price is required")
    .isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
  check("is_available")
    .exists().withMessage("Availability is required")
    .isBoolean().withMessage("is_available must be a boolean"),
  
  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware to validate room ID
export const validateRoomId = [
  check("room_id")
    .isInt({ gt: 0 }).withMessage("Invalid room ID"),
  
  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
