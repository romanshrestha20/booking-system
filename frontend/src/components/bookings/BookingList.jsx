import React, { useEffect, useState } from "react";
import { getBookings } from "../../services/bookingApi";
import { getUserById } from "../../services/userApi"; // Import the getUserById function
import { useNavigate } from "react-router-dom";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        // Fetch user details for each booking
        const bookingsWithGuestNames = await Promise.all(
          data.map(async (booking) => {
            const userResponse = await getUserById(booking.user_id);
            const guestName = userResponse.user.name; // Access the user object from the response
            return { ...booking, guest_name: guestName }; // Add guest_name to the booking object
          })
        );
        setBookings(bookingsWithGuestNames);
      } catch (err) {
        setError("Failed to fetch bookings. Please try again later.");
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleViewDetails = (bookingId) => {
    // Navigate to the booking details page
    navigate(`/bookings/${bookingId}`);
  };

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>Bookings</h2>
     {error && <div>Error: {error}</div>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.booking_id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <p>Guest Name: {booking.guest_name}</p>
            <p>
              Check-In: {new Date(booking.check_in_date).toLocaleDateString()}
            </p>
            <p>
              Check-Out: {new Date(booking.check_out_date).toLocaleDateString()}
            </p>
            <p>Total Price: ${booking.total_price}</p>
            <p>Status: {booking.status}</p>
            <button onClick={() => handleViewDetails(booking.booking_id)}>
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingList;