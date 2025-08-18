import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [movieForm, setMovieForm] = useState({ 
    title: "", 
    genre: "", 
    poster: "", 
    description: "", 
    ticketPrice: ""
  });
  const [editingMovie, setEditingMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("http://localhost:5000/api/movies/admin", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch movies");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSaveMovie = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login as admin first");
      
      if (editingMovie) {
        await axios.put(`http://localhost:5000/api/movies/${editingMovie._id}`, movieForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`Movie updated: ${movieForm.title}`);
        setEditingMovie(null);
      } else {
        await axios.post("http://localhost:5000/api/movies", movieForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`Movie added: ${movieForm.title}`);
      }
      
      setMovieForm({ title: "", genre: "", poster: "", description: "", ticketPrice: "" });
      fetchMovies();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save movie");
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login as admin first");
      if (!window.confirm("Are you sure you want to delete this movie?")) {
          return;
      }
      await axios.delete(`http://localhost:5000/api/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Movie deleted successfully");
      fetchMovies();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete movie");
    }
  };
  
  const handleEditClick = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      genre: movie.genre,
      poster: movie.poster,
      description: movie.description,
      ticketPrice: movie.ticketPrice
    });
  };
  
  const handleCancelEdit = () => {
    setEditingMovie(null);
    setMovieForm({ title: "", genre: "", poster: "", description: "", ticketPrice: "" });
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-100 flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-700 font-sans text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-700 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">{editingMovie ? "Edit Movie" : "Add New Movie"}</h2>
        <input 
          type="text" 
          placeholder="Title" 
          className="border border-gray-600 bg-gray-700 text-white p-2 w-full mb-4 rounded" 
          value={movieForm.title} 
          onChange={e=>setMovieForm({...movieForm, title: e.target.value})}
        />
        <input 
          type="text" 
          placeholder="Genre" 
          className="border border-gray-600 bg-gray-700 text-white p-2 w-full mb-4 rounded" 
          value={movieForm.genre} 
          onChange={e=>setMovieForm({...movieForm, genre: e.target.value})}
        />
        <input 
          type="text" 
          placeholder="Poster URL" 
          className="border border-gray-600 bg-gray-700 text-white p-2 w-full mb-4 rounded" 
          value={movieForm.poster} 
          onChange={e=>setMovieForm({...movieForm, poster: e.target.value})}
        />
        <input 
          type="number" 
          placeholder="Ticket Price (e.g., 250)" 
          className="border border-gray-600 bg-gray-700 text-white p-2 w-full mb-4 rounded" 
          value={movieForm.ticketPrice} 
          onChange={e=>setMovieForm({...movieForm, ticketPrice: e.target.value})}
        />
        <textarea 
          placeholder="Description" 
          className="border border-gray-600 bg-gray-700 text-white p-2 w-full mb-4 rounded" 
          value={movieForm.description} 
          onChange={e=>setMovieForm({...movieForm, description: e.target.value})}
        />
        <div className="flex gap-2">
            <button onClick={handleSaveMovie} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
              {editingMovie ? "Update Movie" : "Add Movie"}
            </button>
            {editingMovie && (
                <button onClick={handleCancelEdit} className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600">
                    Cancel
                </button>
            )}
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Existing Movies</h2>
        {movies.length === 0 ? (
          <p className="text-gray-300">No movies added yet.</p>
        ) : (
          <ul>
            {movies.map(movie => (
              <li key={movie._id} className="flex justify-between items-center p-3 border-b border-gray-700">
                <span>{movie.title} - ₹{movie.ticketPrice}</span>
                <div>
                  <button 
                    onClick={() => handleEditClick(movie)} 
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition mr-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteMovie(movie._id)} 
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
