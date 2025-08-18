import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/movies");
      setMovies(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => { fetchMovies(); }, []);
  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-100 font-sans bg-gradient-to-br from-gray-900 to-gray-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Now Showing</h2>
      {movies.length === 0 ? (
        <p className="text-center text-xl text-gray-300">No movies available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {movies.map(m => <MovieCard key={m._id} movie={m} />)}
        </div>
      )}
    </div>
  );
}
