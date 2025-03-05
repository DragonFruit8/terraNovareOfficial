import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_CLIENT_URL_PROD || "https://terranovare.tech/api"; // Production
const DEV_BASE_URL =
  process.env.REACT_APP_CLIENT_URL_DEV || "http://localhost:9000/api"; // Development

const isProduction = process.env.NODE_ENV === "production";
const baseURL = isProduction ? API_BASE_URL : DEV_BASE_URL;

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
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // ✅ Ensure proper headers for media uploads
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Export Axios instance
export default axiosInstance;
