import axiosInstance from "../api/axios.config";

export const login = async (email, password) => {
  email = email.toLowerCase();
  return axiosInstance.post("/api/auth/login", { email, password });
};

// ✅ Fix: Assign to a variable before exporting
const authService = { login };

export default authService;
