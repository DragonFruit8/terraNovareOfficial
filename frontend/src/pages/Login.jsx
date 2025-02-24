import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios.config";

const Login = () => {
  const { setUserData, userData, loading } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check if a user profile is incomplete
  const isProfileIncomplete = (user) => {
    return !user?.fullname || !user?.address || !user?.city;
  };

  // Handle Login Request
  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // Authenticate the user
    const response = await axiosInstance.post("/auth/login", formData);
    const { token } = response.data;

    if (!token) {
      throw new Error("Authentication failed. No token received.");
    }

    // Store token in local storage
    localStorage.setItem("token", token);

    // Fetch updated user details after login
    const userResponse = await axiosInstance.get("/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = userResponse.data;

    if (!user) {
      throw new Error("Failed to fetch user data.");
    }

    // Update context and local storage with the latest user data
    setUserData(user);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Login successful!");

    // Redirect user based on profile completeness
    if (isProfileIncomplete(user)) {
      toast.info("Please complete your profile.");
      navigate("/complete-profile");
    } else {
      navigate("/");
    }
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    toast.error(error.response?.data?.error || "Login failed");
  }
};

  // Handle Google Login (Placeholder)
  const handleGoogleLogin = () => {
    console.log("Google Sign-In clicked!");
    // TODO: Implement Google OAuth Redirect
  };

  // If user is already logged in, check profile status
  useEffect(() => {
    if (!loading && userData) {
      if (isProfileIncomplete(userData)) {
        navigate("/complete-profile");
      } else {
        navigate("/");
      }
    }
  }, [userData, loading, navigate]);

  return (
    <div className="container-sm mt-5">
      
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="on"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="on"
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Login</button>
          <button type="button" className="btn btn-danger" onClick={handleGoogleLogin}>
            Sign in with Google
          </button>
        </div>
      </form>
      <div className="my-2">
        <p>Not a user yet? <Link to="/register">Register</Link> Now!</p>
      </div>
      <div className="my-2">
        <p>Forgot Password? <Link to="/forgot">Reset Here</Link></p>
      </div>
    </div>
  );
};

export default Login;
