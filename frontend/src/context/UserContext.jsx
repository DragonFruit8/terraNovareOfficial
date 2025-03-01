import { createContext, useState, useContext, useEffect, useCallback } from "react";
import axiosInstance from "../api/axios.config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
const [userData, setUserData] = useState(null);
const [roles, setRoles] = useState([]);
const [loading, setLoading] = useState(true);

const fetchUser = useCallback(async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.warn("🚫 No token found, user is not authenticated.");
    setLoading(false);
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout in 5s

  try {
    const response = await axiosInstance.get("/user/me", {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal, // Attach abort signal
    });

    setUserData(response.data);
    setRoles(response.data.roles ?? []);
    sessionStorage.setItem("user", JSON.stringify(response.data));
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("⏳ Request timed out. Retrying...");
      return; // Prevent setting state after timeout
    }
    if (error.response?.status === 401) {
      console.warn("🚫 Invalid token detected. Logging out...");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setUserData(null);
    } else {
      console.error("❌ Error fetching user:", error.response?.data || error.message);
    }
  } finally {
    clearTimeout(timeoutId); // Ensure timeout is cleared
    setLoading(false);
  }
}, []);

useEffect(() => {
  fetchUser();
}, [fetchUser]);


useEffect(() => {
  fetchUser();
}, [fetchUser]);

  // ✅ Instead of navigating, return a flag if the profile is incomplete
  const isProfileIncomplete = (userData) => {
    return !userData?.address || !userData?.city || !userData?.state || !userData?.country;
  };

  const logout = () => {
    // console.log("🚪 Logging out user...");
  
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
  
    setUserData(null); // Clear user state if using React Context
  };
  

  return (
    <UserContext.Provider value={{ userData, setUserData, logout, roles, loading, isProfileIncomplete }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
