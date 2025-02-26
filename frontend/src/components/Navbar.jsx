import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios.config";

const Navbar = () => {
  const navigate = useNavigate();
    const { setUserData, userData, loading, setLoading, theme } = useUser();

    // ✅ Fetch User Data on Mount
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("Unauthorized: Please log in again.");
            return;
          }
  
          const response = await axiosInstance.get("/user/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          setUserData(response.data);
          setLoading(false);

        } catch (error) {
          console.error("❌ Error fetching user data:", error);
          toast.error("Failed to load profile data.");
        }
      };
  
      fetchUserProfile();
    }, [setUserData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav id="heroNav" className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">E-Commerce</Link>
        <div>
          <Link className="btn btn-primary mx-2" to="cart">Cart</Link>
          {localStorage.getItem("token") ? (
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link className="btn btn-secondary mx-2" to="login">Login</Link>
              <Link className="btn btn-success" to="register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
