import { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axios.config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
const [userData, setUserData] = useState(null);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          // console.warn("🚫 No token found, user is not authenticated.");
          setLoading(false);
          return;
        }
        const response = await axiosInstance.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
        sessionStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("❌ Error fetching user:", error.response?.data || error.message);

        // ✅ If unauthorized, remove invalid token
        if (error.response?.status === 401) {
          console.warn("🚫 Invalid token detected. Logging out...");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          setUserData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Instead of navigating, return a flag if the profile is incomplete
  const isProfileIncomplete = (userData) => {
    return !userData?.address || !userData?.city || !userData?.state || !userData?.country;
  };

  const logout = () => {
    console.log("🚪 Logging out user...");
  
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
  
    setUserData(null); // Clear user state if using React Context
  };
  

  return (
    <UserContext.Provider value={{ userData, setUserData, logout, loading, isProfileIncomplete }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
