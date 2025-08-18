const express = require("express");
const Movie = require("../models/Movie");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin: Add movie with ticket price
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, genre, poster, description, ticketPrice } = req.body;
    
    const createSeats = (rows, cols) => {
      const seats = [];
      for (let i = 0; i < rows; i++) {
        const rowChar = String.fromCharCode(65 + i);
        for (let j = 1; j <= cols; j++) {
          seats.push({ seatNumber: `${rowChar}${j}`, isBooked: false });
        }
      }
      return seats;
    };

    const defaultShowtimes = [
      { 
        time: "10:00 AM", 
        seats: createSeats(8, 10)
      },
      { 
        time: "01:00 PM", 
        seats: createSeats(8, 10)
      },
    ];

    const movie = new Movie({
      title,
      genre,
      poster,
      description,
      timings: defaultShowtimes,
      ticketPrice
    });
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save movie" });
  }
});

// Admin: Get all movies (for admin dashboard)
router.get("/admin", protect, adminOnly, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// Admin: Delete a movie
router.delete("/:movieId", protect, adminOnly, async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findByIdAndDelete(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Update a movie
router.put("/:movieId", protect, adminOnly, async (req, res) => {
  try {
    const { movieId } = req.params;
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(updatedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update movie" });
  }
});

// Public: Get all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// ✅ Public: Search movies by title or genre
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } }
      ]
    });
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to search movies" });
  }
});


// GET /api/movies/:movieId
router.get("/:movieId", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /api/movies/:movieId/showtime/:showtimeId
router.get("/:movieId/showtime/:showtimeId", async (req, res) => {
  try {
    const { movieId, showtimeId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    const showtime = movie.timings.id(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    res.json(showtime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/movies/:movieId/showtime/:showtimeId
router.put("/:movieId/showtime/:showtimeId", protect, async (req, res) => {
  try {
    const { movieId, showtimeId } = req.params;
    const { seats } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    const showtime = movie.timings.id(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    showtime.seats.forEach((seat) => {
        if (seats.includes(seat.seatNumber)) {
            seat.isBooked = true;
        }
    });
    await movie.save();
    res.json({ message: "Seats booked successfully", showtime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
