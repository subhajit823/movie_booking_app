import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const SeatSelection = () => {
  const { movieId, showtimeId } = useParams();
  const navigate = useNavigate();

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieAndSeats = async () => {
      try {
        const movieRes = await axios.get(`http://localhost:5000/api/movies/${movieId}`);
        setMovie(movieRes.data);

        const showtimeRes = await axios.get(
          `http://localhost:5000/api/movies/${movieId}/showtime/${showtimeId}`
        );
        setShowtime(showtimeRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie or showtime details.");
        setLoading(false);
      }
    };
    fetchMovieAndSeats();
  }, [movieId, showtimeId]);

  const handleSeatClick = (seatNumber, isBooked) => {
    if (isBooked) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to book tickets.");
        return navigate("/login");
      }

      // Here you would integrate with a payment gateway.
      // For now, we'll simulate a successful payment.
      alert(`Initiating payment of ₹${movie.ticketPrice * selectedSeats.length}`);
      
      // After successful payment, we'll proceed with booking
      await handleBooking();

    } catch (err) {
      console.error(err);
      alert("Payment failed!");
    }
  };

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const seatsToBook = selectedSeats.map(seatNumber => ({ seatNumber }));

      await axios.post(
        `http://localhost:5000/api/bookings`,
        {
          movieId,
          showtimeId,
          seats: seatsToBook
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Booking Successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking Failed!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading seats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  if (!showtime) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="text-xl font-semibold text-red-500">Showtime data not found.</div>
        </div>
      );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-100 flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="bg-gray-800 p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-4xl text-center border border-gray-700">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Select Your Seats
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Showtime: {showtime.time}
        </p>

        {/* Legend for seat status */}
        <div className="flex justify-center items-center gap-6 mb-10 text-gray-300 font-medium text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2 shadow"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2 shadow"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2 shadow"></div>
            <span>Booked</span>
          </div>
        </div>
        
        {/* Screen */}
        <div className="w-full bg-black text-white text-center py-3 rounded-t-lg shadow-inner mb-6 transform -skew-x-12">
            Screen
        </div>

        {/* Seats Grid */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-inner mb-10">
          <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 lg:grid-cols-20 gap-2 md:gap-3 justify-center">
            {showtime.seats.map((seat) => (
              <button
                key={seat.seatNumber}
                onClick={() => handleSeatClick(seat.seatNumber, seat.isBooked)}
                disabled={seat.isBooked}
                className={`
                  p-2 rounded-lg font-bold text-sm shadow-md transform transition-all duration-200 focus:outline-none focus:ring-2
                  ${
                    seat.isBooked
                      ? "bg-red-500 text-white cursor-not-allowed opacity-70"
                      : selectedSeats.includes(seat.seatNumber)
                      ? "bg-yellow-400 text-gray-900 scale-110 ring-yellow-600"
                      : "bg-green-500 text-white hover:bg-green-600 hover:scale-105"
                  }`
                }
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-white">
          <p className="text-lg font-semibold mb-4">
            Seats Selected: <span className="text-yellow-400 font-bold">{selectedSeats.length}</span>
          </p>
          <p className="text-lg font-semibold mb-4">
            Total Price: <span className="text-yellow-400 font-bold">₹{movie ? movie.ticketPrice * selectedSeats.length : 0}</span>
          </p>
          <button
            onClick={handlePayment}
            disabled={selectedSeats.length === 0}
            className="w-full md:w-auto px-10 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed animate-pulse"
          >
            Pay Now ({selectedSeats.length} seats)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
