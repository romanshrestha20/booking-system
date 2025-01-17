import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getRoomById } from "../../services/roomApi";
import { getBookings, getBookingsByUserId, deleteBooking } from "../../services/bookingApi"; // Import deleteBooking

const ViewBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState({}); // State to store room details by room ID

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        let bookingsData;

        // Fetch bookings based on user role
        if (user.role === "admin") {
          // Admin: Fetch all bookings
          bookingsData = await getBookings();
        } else {
          // Customer: Fetch bookings for the logged-in user
          const user_id = user.user_id;
          bookingsData = await getBookingsByUserId(user_id);
        }

        // Fetch room details for each booking
        const roomDetails = {};
        for (const booking of bookingsData) {
          const roomResponse = await getRoomById(booking.room_id);
          roomDetails[booking.room_id] = roomResponse.room; // Store room details by room ID
        }

        setBookings(bookingsData); // Set bookings
        setRooms(roomDetails); // Set room details
      } catch (error) {
        setError("Failed to fetch bookings. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user.user_id, user.role]); // Dependency is user.user_id and user.role

  const handleCancelBooking = async (bookingId) => {
    confirmAlert({
      title: "Confirm Cancellation",
      message: "Are you sure you want to cancel this booking?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await deleteBooking(bookingId); // Call the deleteBooking API
              // Remove the canceled booking from the state
              setBookings((prevBookings) =>
                prevBookings.filter((booking) => booking.booking_id !== bookingId)
              );
              alert("Booking canceled successfully!");
            } catch (error) {
              console.error("Failed to cancel booking:", error);
              alert("Failed to cancel booking. Please try again.");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {user.role === "admin" ? "All Bookings" : "My Bookings"}
        </h1>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Skeleton width={50} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Skeleton width={50} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Skeleton width={80} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Skeleton width={80} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Skeleton width={80} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Skeleton width={80} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {user.role === "admin" ? "All Bookings" : "My Bookings"}
      </h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.booking_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => navigate(`/rooms/${booking.room_id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {rooms[booking.room_id]?.room_number || "Loading..."}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(booking.check_in_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(booking.check_out_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => navigate(`/bookings/${booking.booking_id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking.booking_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewBookings;