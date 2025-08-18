import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function ReviewSection({ movieId, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [editingReviewId, setEditingReviewId] = useState(null); // ✅ State to track which review is being edited
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}"); // ✅ Get current user from localStorage

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${movieId}`);
      setReviews(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reviews.");
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchReviews();
  }, [movieId, fetchReviews]);

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to submit a review.");
        return;
      }
      // ✅ Check if we are editing or adding a new review
      if (editingReviewId) {
        await axios.put(
          `http://localhost:5000/api/reviews/${editingReviewId}`,
          reviewForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Review updated successfully!");
        setEditingReviewId(null);
      } else {
        await axios.post(
          `http://localhost:5000/api/reviews/${movieId}`,
          reviewForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Review submitted successfully!");
      }
      setReviewForm({ rating: 0, comment: "" });
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit review.");
    }
  };
  
  // ✅ Function to handle review deletion
  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      if (!window.confirm("Are you sure you want to delete this review?")) {
          return;
      }
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Review deleted successfully!");
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete review.");
    }
  };
  
  // ✅ Function to handle edit click
  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setReviewForm({ rating: review.rating, comment: review.comment });
  };
  
  // ✅ Function to cancel editing
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setReviewForm({ rating: 0, comment: "" });
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-2xl text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-2xl font-bold mb-6 text-center">Reviews</h3>
        
        {/* Review Submission Form */}
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <h4 className="text-lg font-semibold mb-2">{editingReviewId ? "Edit Your Review" : "Submit Your Review"}</h4>
          <form onSubmit={handleReviewSubmit}>
            <div className="flex items-center gap-1 mb-4">
              {Array(5).fill(0).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-8 w-8 cursor-pointer transition-colors duration-200 ${i < reviewForm.rating ? 'text-yellow-400' : 'text-gray-500'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  onClick={() => setReviewForm({...reviewForm, rating: i + 1})}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <textarea
              placeholder="Write your review here..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
              className="w-full p-2 bg-gray-600 rounded-lg border border-gray-500 mb-4 focus:outline-none text-white"
            ></textarea>
            <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600">
                    {editingReviewId ? "Update Review" : "Submit Review"}
                </button>
                {editingReviewId && (
                    <button onClick={handleCancelEdit} className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600">
                        Cancel
                    </button>
                )}
            </div>
          </form>
        </div>

        {/* Displaying existing reviews */}
        {loading ? (
          <div className="text-center text-gray-400">Loading reviews...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-400">No reviews yet.</div>
        ) : (
          <div className="mt-6 max-h-80 overflow-y-auto custom-scrollbar">
            <h4 className="text-lg font-semibold mb-4">All Reviews ({reviews.length})</h4>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold">{review.user.name}</p>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {review.comment && <p className="text-gray-300">{review.comment}</p>}
                  {/* ✅ Show edit and delete buttons only for the user who wrote the review */}
                  {currentUser && currentUser._id === review.user._id && (
                      <div className="mt-2 flex justify-end gap-2">
                          <button
                              onClick={() => handleEditClick(review)}
                              className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                          >
                              Edit
                          </button>
                          <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                          >
                              Delete
                          </button>
                      </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
