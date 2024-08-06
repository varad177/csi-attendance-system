import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const useInSession = sessionStorage.getItem('csiAdmin');
    if (useInSession) {
        toast.success('Already logged in');
        navigate('/admin/csi-admin-home');
    }
}, [navigate]); // Ensure navigate is in the dependency array if it's used


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

  
    const data = {
      email: email.toLowerCase(),
      password: password,
    };

    try {
      const response = await axiosInstance.post("/admin/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      sessionStorage.setItem("csiAdmin" , JSON.stringify(response.data.dataToSend))
      navigate('/admin/csi-admin-home')
      return toast.success(response.data.message)
      // Handle successful login, e.g., redirect or set auth token
    } catch (err) {
      console.error("Login Failed:", err);
      console.log(err);
       return toast.error(err.response.data.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
