const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");
const Movie = require("../models/Movie");

// ✅ Create a new booking
router.post("/", protect, async (req, res) => {
  try {
    const { movieId, showtimeId, seats } = req.body;
    const userId = req.user._id;

    // Fetch movie details to get the ticket price
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    const totalPrice = seats.length * movie.ticketPrice;

    // Create the booking
    const booking = new Booking({
      user: userId,
      movie: movieId,
      showtime: showtimeId,
      seats,
      totalPrice,
    });

    const savedBooking = await booking.save();

    // Mark seats as booked in the Movie model
    const showtime = movie.timings.id(showtimeId);
    showtime.seats.forEach((seat) => {
      if (seats.some(s => s.seatNumber === seat.seatNumber)) {
        seat.isBooked = true;
      }
    });
    await movie.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
});

// ✅ Get user's booking history
router.get("/my-bookings", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId })
      .populate("movie", "title poster timings") // Get movie title and poster
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// ✅ Cancel a specific booking
router.put("/cancel/:bookingId", protect, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Cancel all seats in the booking
    const movie = await Movie.findById(booking.movie);
    const showtime = movie.timings.id(booking.showtime);

    booking.seats.forEach(bookedSeat => {
        const seatToCancel = showtime.seats.find(s => s.seatNumber === bookedSeat.seatNumber);
        if (seatToCancel) {
            seatToCancel.isBooked = false;
        }
    });

    await movie.save();

    // Remove the booking
    await Booking.findByIdAndDelete(bookingId);

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});

module.exports = router;
