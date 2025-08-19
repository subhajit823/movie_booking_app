import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`https://movie-booking-app-xi-eight.vercel.app/api/auth/reset-password/${token}`, {
        newPassword
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            className="border p-2 w-full mb-4 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border p-2 w-full mb-4 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
            Reset Password
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
