import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SeatSelection from "./pages/SeatSelection";
import MovieDetails from "./pages/MovieDetails";
import UserDashboard from "./pages/UserDashboard";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import SearchPage from "./components/SearchPage"; 

function PrivateAdminRoute({ children }) {
  const [status, setStatus] = useState({ checking: true, allowed: false });

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus({ checking: false, allowed: false });
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.isAdmin) {
          setStatus({ checking: false, allowed: true });
        } else {
          setStatus({ checking: false, allowed: false });
        }
      } catch (err) {
        console.error("Admin check failed:", err.response?.data || err.message);
        setStatus({ checking: false, allowed: false });
      }
    };
    check();
  }, []);

  if (status.checking) return <div className="p-6">Checking admin access...</div>;
  if (!status.allowed) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={
          <PrivateAdminRoute>
            <AdminDashboard />
          </PrivateAdminRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
        <Route path="/seat-selection/:movieId/:showtimeId" element={<SeatSelection />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/search/:query" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}
