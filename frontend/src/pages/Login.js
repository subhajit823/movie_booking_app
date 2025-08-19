import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Link added

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://movie-booking-app-xi-eight.vercel.app/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen font-sans bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-96 text-white border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          className="border border-gray-600 bg-gray-700 p-2 w-full mb-4 rounded text-white" 
          value={form.email} 
          onChange={e=>setForm({...form,email:e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="border border-gray-600 bg-gray-700 p-2 w-full mb-4 rounded text-white" 
          value={form.password} 
          onChange={e=>setForm({...form,password:e.target.value})}
        />
        <button onClick={handleLogin} className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors duration-200">
          Login
        </button>
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-blue-400 hover:underline">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}
