import axios from "axios";

// ✅ Ensure environment variables are loaded correctly
const API_BASE_URL =
  process.env.REACT_APP_CLIENT_URL_PROD || "https://terranovare.tech/api"; // Production
const DEV_BASE_URL =
  process.env.REACT_APP_CLIENT_URL_DEV || "http://localhost:9000/api"; // Development

const isProduction = process.env.NODE_ENV === "production";
// ✅ Use fallback URL in case env vars are missing
const baseURL = isProduction ? API_BASE_URL : DEV_BASE_URL;
// ✅ Debugging logs
console.log(`✅ Axios Base URL: ${baseURL} (Mode: ${process.env.NODE_ENV})`);
// ✅ Create Axios instance
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    console.log("🔍 API Base URL:", baseURL);
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
