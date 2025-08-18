import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700">
      <img 
        src={movie.poster} 
        alt={movie.title} 
        className="w-full h-80 object-cover" 
      />
      <div className="p-5">
        <h3 className="text-2xl font-bold text-white mb-1">{movie.title}</h3>
        <p className="text-gray-400 mb-3">{movie.genre}</p>
        <p className="text-xl font-extrabold text-yellow-400">
          Price: ₹{movie.ticketPrice}
        </p>
        <Link 
          to={`/movie/${movie._id}`}
          className="mt-5 inline-block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md transition-colors duration-200 hover:bg-blue-700"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
