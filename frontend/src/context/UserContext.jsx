import { createContext, useState, useContext, useEffect, useCallback } from "react";
import axiosInstance from "../api/axios.config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.warn("🚫 No token found, user is not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data);
      setRoles(response.data.roles ?? []);
      sessionStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("🚫 Invalid token detected. Logging out...");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setUserData(null);
      } else {
        console.error("❌ Error fetching user:", error.response?.data || error.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
    }
  }, [userData]);

// ✅ Log inside isProfileIncomplete()
const isProfileIncomplete = useCallback(() => {
  const incomplete = !userData?.address || !userData?.city || !userData?.state || !userData?.country; // ❌ Removed `zip`
  console.log("🔍 Debug: isProfileIncomplete result:", incomplete);
  return incomplete;
}, [userData]);


const updateUserProfile = async (updatedData) => {
  try {
    await axiosInstance.put("/user/update", updatedData);
    await fetchUser(); // ✅ Ensures latest userData is fetched from backend
  } catch (error) {
    console.error("❌ Error updating profile:", error.response?.data || error.message);
  }
};



  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserData(null);
  };

  return (
    <UserContext.Provider
      value={{ userData, setUserData, updateUserProfile, logout, roles, loading, isProfileIncomplete }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
