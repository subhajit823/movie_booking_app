import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your bookings.");
        setLoading(false);
        return;
      }
      const res = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch bookings.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (!window.confirm("Are you sure you want to cancel this booking?")) {
        return;
      }
      
      await axios.put(
        `http://localhost:5000/api/bookings/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Booking cancelled successfully!");
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center text-lg mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-100 flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-700 font-sans text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-300">You have no booking history.</p>
      ) : (
        <div className="grid gap-6 w-full max-w-4xl">
          {bookings.map((booking) => {
            const showtime = booking.movie.timings.find(t => t._id.toString() === booking.showtime);
            return (
              <div key={booking._id} className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center md:items-start gap-6 border border-gray-700">
                <img src={booking.movie.poster} alt={booking.movie.title} className="w-full md:w-32 h-auto rounded-lg shadow-sm" />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-white">{booking.movie.title}</h3>
                  <p className="text-gray-400">Booking Date: {format(new Date(booking.bookingDate), "PPp")}</p>
                  <p className="text-gray-400 mt-2">Showtime: {showtime ? showtime.time : 'N/A'}</p>
                  <p className="text-gray-400">Seats: {booking.seats.map(s => s.seatNumber).join(", ")}</p>
                  <p className="text-lg font-bold text-yellow-400 mt-2">Total Price: ₹{booking.totalPrice}</p>
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
