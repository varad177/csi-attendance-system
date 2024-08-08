// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://csi-attendance-system-server.onrender.com', // Replace with your API's base URL
  baseURL: 'http://localhost:3000', // Replace with your API's base URL
  timeout: 10000, // Set a timeout limit for requests
  headers: { 'Content-Type': 'application/json' }
});

export default axiosInstance;
