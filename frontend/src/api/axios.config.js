import axios from "axios";

// Use environment variables for base URL
const API_BASE_URL =
  process.env.REACT_APP_CLIENT_URL_PROD || "https://terranovare.tech/api"; // Production
const DEV_BASE_URL =
  process.env.REACT_APP_CLIENT_URL_DEV || "http://localhost:9000/api"; // Development

const baseURL = process.env.NODE_ENV === "production" ? API_BASE_URL : DEV_BASE_URL;

// ✅ Create Axios instance
const axiosInstance = axios.create({
  baseURL,
  timeout: 60000, // 60 seconds
});

// ✅ Automatically attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found. Some requests may be unauthorized.");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response, // ✅ Return response normally
  (error) => {
    console.error("🚨 API Error Intercepted:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      sessionStorage.removeItem("token");
      window.location.href = "/login"; // ✅ Redirect to login
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;