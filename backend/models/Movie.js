const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  isBooked: { type: Boolean, default: false }
});

const showtimeSchema = new mongoose.Schema({
  time: { type: String, required: true },
  seats: [seatSchema]
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  poster: { type: String, required: true },
  description: String,
  timings: [showtimeSchema],
  ticketPrice: { type: Number, required: true },
  averageRating: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);
