import axios from "axios";

// ✅ Ensure environment variables are loaded correctly
const API_BASE_URL =
  process.env.REACT_APP_CLIENT_URL_PROD || "https://terranovare.tech/api"; // Production
const DEV_BASE_URL =
  process.env.REACT_APP_CLIENT_URL_DEV || "http://localhost:9000/api"; // Development

const isProduction = process.env.NODE_ENV === "production";
const baseURL = isProduction ? API_BASE_URL : DEV_BASE_URL;

// ✅ Create Axios instance with default settings
const axiosInstance = axios.create({
  baseURL,
  timeout: 60000, // ⏳ Set timeout to 60 seconds (60000ms)
});

// ✅ Function to get headers dynamically
const getHeaders = (contentType = "application/json") => {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": contentType,
    ...(token && { Authorization: `Bearer ${token}` }), // ✅ Attach token if available
  };
};

// ✅ Automatically attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers = {
      ...getHeaders(config.headers["Content-Type"] || "application/json"),
      ...config.headers, // Preserve existing headers
    };
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Generic API request function
const request = async (method, url, data = null, contentType = "application/json") => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      headers: getHeaders(contentType),
    });
    return response.data;
  } catch (error) {
    console.error(`❌ API Error (${method.toUpperCase()} ${url}):`, error);
    throw error;
  }
};

// ✅ Upload music file (multipart request)
const uploadMusicFile = (file) => {
  const formData = new FormData();
  formData.append("music", file);

  return request("post", "/uploads", formData, "multipart/form-data");
};

export { axiosInstance, request, uploadMusicFile };
