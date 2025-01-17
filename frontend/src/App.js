import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgetPassword from "./components/auth/ForgetPassword";
import ResetPassword from "./components/auth/ResetPassword";
import RoomList from "./components/rooms/RoomList";
import RoomDetail from "./components/rooms/RoomDetail";
import BookingList from "./components/bookings/BookingList";
import BookingDetail from "./components/bookings/BookingDetail";
import Navbar from "./components/Navbar";
import ViewBookings from "./components/bookings/ViewBookings";

function App() {
  return (
    <Router>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/rooms/:roomId" element={<RoomDetail />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute requiredRole="customer">
                  <BookingList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/:bookingId"
              element={
                <ProtectedRoute requiredRole="customer">
                  <BookingDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <ViewBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Not Found Route */}
            <Route
              path="*"
              element={
                <div className="text-center py-20">
                  <h1 className="text-4xl font-bold text-gray-800">
                    404 - Not Found
                  </h1>
                  <p className="mt-4 text-gray-600">
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              }
            />
          </Routes>
        </div>
      </main>

      {/* Footer (Optional) */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Booking System. All rights
            reserved.
          </p>
        </div>
      </footer>
    </Router>
  );
}

export default App;