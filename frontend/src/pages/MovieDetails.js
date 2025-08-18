import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ReviewSection from "../components/ReviewSection"; // ✅ New import

export default function MovieDetails() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false); // ✅ State for modal

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${movieId}`);
        setMovie(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-500'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading movie details...</div>;
  }

  if (!movie) {
    return <div className="text-center text-lg mt-10 text-red-500">Movie not found!</div>;
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-100 flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-700 font-sans text-white">
      <div className="bg-gray-800 p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-700">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full md:w-1/2 h-auto rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold">{movie.title}</h2>
            <p className="text-gray-400 text-lg mb-2">{movie.genre}</p>
            <p className="text-yellow-400 font-bold mb-4">Price: ₹{movie.ticketPrice}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-yellow-400">{movie.averageRating.toFixed(1)}</span>
              {renderStars(movie.averageRating)}
              <button 
                onClick={() => setShowReviewModal(true)} 
                className="text-blue-400 hover:underline text-sm ml-2"
              >
                Show Reviews
              </button>
            </div>
            <p className="text-gray-300">{movie.description}</p>
            <h3 className="text-xl font-bold mt-6 mb-4">Showtimes:</h3>
            <div className="grid grid-cols-2 gap-4">
              {movie.timings.map((timing) => (
                <Link
                  key={timing._id}
                  to={`/seat-selection/${movie._id}/${timing._id}`}
                  className="bg-green-500 text-white text-center py-3 rounded-lg hover:bg-green-600 transition"
                >
                  {timing.time}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showReviewModal && (
        <ReviewSection movieId={movieId} onClose={() => setShowReviewModal(false)} />
      )}
    </div>
  );
}
