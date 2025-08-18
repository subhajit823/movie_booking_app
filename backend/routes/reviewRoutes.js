const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Review = require("../models/Review");
const Movie = require("../models/Movie");

// Function to update the average rating of a movie
const updateMovieRating = async (movieId) => {
  const reviews = await Review.find({ movie: movieId });
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  
  await Movie.findByIdAndUpdate(movieId, { averageRating }, { new: true });
};

// POST /api/reviews/:movieId - Submit a new review
router.post("/:movieId", protect, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, comment } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const existingReview = await Review.findOne({ user: req.user._id, movie: movieId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this movie" });
    }

    const review = await Review.create({
      user: req.user._id,
      movie: movieId,
      rating,
      comment
    });

    await updateMovieRating(movieId);

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

// ✅ GET /api/reviews/:movieId - Get all reviews for a movie
router.get("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movie: movieId }).populate("user", "name");
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// ✅ PUT /api/reviews/:reviewId - Update a review
router.put("/:reviewId", protect, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    
    const review = await Review.findOne({ _id: reviewId, user: req.user._id });
    if (!review) {
      return res.status(404).json({ message: "Review not found or you are not the owner" });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();
    
    await updateMovieRating(review.movie);

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update review" });
  }
});

// ✅ DELETE /api/reviews/:reviewId - Delete a review
router.delete("/:reviewId", protect, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({ _id: reviewId, user: req.user._id });
    if (!review) {
      return res.status(404).json({ message: "Review not found or you are not the owner" });
    }

    await updateMovieRating(review.movie);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete review" });
  }
});

module.exports = router;
