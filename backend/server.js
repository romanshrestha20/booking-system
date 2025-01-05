import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import roomsRoute from "./routes/roomsRoute.js";
import usersRoute from "./routes/usersRoute.js";
import bookingsRoute from "./routes/bookingsRoute.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from the frontend
  credentials: true,
}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Booking System Backend is running");
});

// Routes
app.use("/api/rooms", roomsRoute);
app.use("/api/", usersRoute);
app.use("/api/bookings", bookingsRoute);

// Error handler middleware (placed at the end)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});