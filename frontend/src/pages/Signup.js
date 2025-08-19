import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post("https://movie-booking-app-xi-eight.vercel.app/api/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Signup successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen font-sans bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-96 text-white border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
        <input 
          type="text" 
          placeholder="Name" 
          className="border border-gray-600 bg-gray-700 p-2 w-full mb-4 rounded text-white" 
          value={form.name} 
          onChange={e=>setForm({...form,name:e.target.value})}
        />
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
        <button onClick={handleSignup} className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors duration-200">
          Signup
        </button>
      </div>
    </div>
  );
}
