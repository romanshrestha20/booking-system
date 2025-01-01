import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import roomsRoute from "./routes/roomsRoute.js";
// import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// Test route
app.get("/", (req, res) => {
  res.send("Booking System Backend is running");
});

// Routes
app.use("/api/rooms", roomsRoute);
// app.use('/api/users', usersRoute);
// app.use('/api/bookings', bookingsRoute);

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
