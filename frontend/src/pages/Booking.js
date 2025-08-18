import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Booking() {
  const { movieId, showtimeId } = useParams(); // URL থেকে movieId আর showtimeId
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/movies/${movieId}/seats/${showtimeId}`)
      .then((res) => {
        setMovie(res.data.movie);
        setShowtime(res.data.showtime);
      })
      .catch((err) => console.error(err));
  }, [movieId, showtimeId]);

  const toggleSeat = (seatNumber) => {
    if (showtime.seats.find((s) => s.seatNumber === seatNumber && s.isBooked)) {
      return; // already booked
    }
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleBooking = async () => {
    try {
      await axios.put(`/api/movies/${movieId}/seats/${showtimeId}`, {
        seats: selectedSeats
      });

      alert(`Booked seats: ${selectedSeats.join(", ")}`);

      // Update local state
      setShowtime((prev) => ({
        ...prev,
        seats: prev.seats.map((seat) =>
          selectedSeats.includes(seat.seatNumber)
            ? { ...seat, isBooked: true }
            : seat
        )
      }));
      setSelectedSeats([]);
    } catch (error) {
      console.error(error);
      alert("Booking failed");
    }
  };

  if (!movie || !showtime) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-80 object-cover rounded"
      />
      <h2 className="text-2xl font-bold mt-4">{movie.title}</h2>
      <p className="text-gray-600 mb-4">{movie.description}</p>
      <h3 className="text-lg font-semibold">
        Showtime: {showtime.time}
      </h3>

      {/* Seats Grid */}
      <div className="mt-6 grid grid-cols-8 gap-2">
        {showtime.seats.map((seat) => (
          <button
            key={seat.seatNumber}
            onClick={() => toggleSeat(seat.seatNumber)}
            disabled={seat.isBooked}
            className={`p-2 rounded text-white text-sm ${
              seat.isBooked
                ? "bg-red-500 cursor-not-allowed"
                : selectedSeats.includes(seat.seatNumber)
                ? "bg-blue-500"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>

      <button
        onClick={handleBooking}
        disabled={selectedSeats.length === 0}
        className="mt-6 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
      >
        Confirm Booking
      </button>
    </div>
  );
}
