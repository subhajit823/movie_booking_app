import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setSearchQuery(""); // Clear the search bar
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">🎬 MovieBooking</Link>
      
      {/* ✅ Search bar moved to the center */}
      <form onSubmit={handleSearch} className="flex-1 mx-4 max-w-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-2 rounded-full border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors duration-200"
          />
          <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-yellow-400">Home</Link>
        {user ? (
          <>
            <span className="text-sm">Welcome, {user.name}</span>
            <Link to="/dashboard" className="hover:text-yellow-400">My Bookings</Link>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-yellow-400">Login</Link>
            <Link to="/signup" className="hover:text-yellow-400">Signup</Link>
          </>
        )}
        <Link to="/admin" className="hover:text-yellow-400">Admin</Link>
      </div>
    </nav>
  );
}
