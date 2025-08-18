import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard";

export default function SearchPage() {
  const { query } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/movies/search/${query}`);
        setMovies(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movies.");
        setLoading(false);
      }
    };
    fetchMovies();
  }, [query]);

  if (loading) {
    return <div className="p-6 text-center text-xl text-white min-h-screen bg-gradient-to-br from-gray-900 to-gray-700">Loading search results...</div>;
  }
  
  if (error) {
      return <div className="p-6 text-center text-xl text-red-500 min-h-screen bg-gradient-to-br from-gray-900 to-gray-700">{error}</div>;
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-100 font-sans bg-gradient-to-br from-gray-900 to-gray-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        Search Results for "{query}"
      </h2>
      {movies.length === 0 ? (
        <p className="text-center text-xl text-gray-300">No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {movies.map(m => <MovieCard key={m._id} movie={m} />)}
        </div>
      )}
    </div>
  );
}
