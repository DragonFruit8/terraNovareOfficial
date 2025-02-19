import { createContext, useState, useContext } from "react";
import axiosInstance from "../api/axios.config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("⚠️ No token found, skipping user fetch.");
        setLoading(false);
        return;
    }

    try {
        const { data } = await axiosInstance.get("/user/me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!data) {
            console.warn("⚠️ Empty response received for user data.");
            setUserData(null);
            return;
        }

        console.log("✅ User data successfully fetched:", data);
        setUserData(data);
    } catch (error) {
        console.error("❌ Error fetching user data:", error?.response?.data || error.message);
        setUserData(null); // Ensure user data is reset on error
    } finally {
        setLoading(false);
    }
};


  // ✅ Add Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
  };

  return (
    <UserContext.Provider
      value={{ userData, setUserData, fetchUserData, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ✅ Function to use User Context
export const useUser = () => useContext(UserContext);
