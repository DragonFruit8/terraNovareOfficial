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
// console.log(`✅ Axios Base URL: ${baseURL} (Mode: ${process.env.NODE_ENV})`);

// ✅ Create Axios instance
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 60000, // ⏳ Set timeout to 60 seconds (60000ms)
});

// ✅ Use the correct Content-Type dynamically
const getHeaders = (type) => {
  return {
    "Content-Type": type,
    Authorization: `Bearer ${sessionStorage.getItem("token")}`, // ✅ Include token if logged in
  };
};

// ✅ Upload music file (multipart request)
const uploadMusicFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("music", file);

    const response = await axiosInstance.post("/uploads", formData, {
      headers: getHeaders("multipart/form-data"),
    });

    return response.data;
  } catch (error) {
    console.error("❌ Upload Error:", error);
  }
};

// ✅ Automatically attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers = {
        ...config.headers, // ✅ Preserve existing headers (important!)
        Authorization: `Bearer ${token}`, // ✅ Attach token properly
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error); // ✅ Ensure errors are properly forwarded
  }
);

export default axiosInstance;