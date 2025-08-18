const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  showtime: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  seats: [{
    seatNumber: { type: String, required: true },
    isCancelled: { type: Boolean, default: false } 
  }],
  totalPrice: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
