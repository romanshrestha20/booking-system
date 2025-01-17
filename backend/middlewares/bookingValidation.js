import { body, validationResult, param } from "express-validator";

export const validateBooking = [
  body("user_id")
    .isInt({ gt: 0 })
    .withMessage("User ID must be a positive integer"),
  body("room_id")
    .isInt({ gt: 0 })
    .withMessage("Room ID must be a positive integer"),
  body("check_in_date")
    .isISO8601()
    .withMessage("Check-in date must be a valid date"),
  body("check_out_date")
    .isISO8601()
    .withMessage("Check-out date must be a valid date"),
  body("total_price")
    .isFloat({ gt: 0 })
    .withMessage("Total price must be a positive number"),
  body("status")
    .optional()
    .isIn(["confirmed", "cancelled"])
    .withMessage('Status must be either "confirmed" or "cancelled"'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware to validate booking ID
export const validateBookingId = [
  param("booking_id")
    .isInt({ gt: 0 })
    .withMessage("Booking ID must be a positive integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Define validation for user_id and room_id
export const validateUserId = [
  param("user_id")
    .isInt({ gt: 0 })
    .withMessage("User ID must be a positive integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    req.user_id = req.params.user_id;
    next();
  },
];

export const validateRoomId = [
  param("room_id")
    .isInt({ gt: 0 })
    .withMessage("Room ID must be a positive integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
