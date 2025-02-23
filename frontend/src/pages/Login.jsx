import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"; // ✅ Ensure Link is imported for navigation

const Login = () => {
  const { setUserData, userData, loading } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Login Request
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", formData);

      const { token, user } = response.data;

      setUserData(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful!");
      if (!userData?.fullname || !userData?.address || !userData?.city) {
        toast.info("Please complete your profile to access this section.");
        navigate("/complete-profile");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  // ✅ Handle Google Login (Placeholder)
  const handleGoogleLogin = () => {
    console.log("Google Sign-In clicked!"); 
    // TODO: Implement Google OAuth Redirect
  };

    // ✅ Redirect when userData is fully loaded
    useEffect(() => {
      if (!loading) { // ✅ Wait until loading is false
        if (!userData || !userData.roles?.includes("admin")) {
          toast.error("Unauthorized Access! Redirecting...");
          navigate("/");
        }
      }
    }, [userData, loading, navigate]);

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange} // ✅ Fix: This now works
            required
            autofill="true"
            autoComplete="on"
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange} // ✅ Fix: This now works
            required
            autoComplete="on"
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <button type="button" className="btn btn-danger" onClick={handleGoogleLogin}>
            Sign in with Google
          </button>
        </div>
      </form>
      <div className="my-2">
        <p>
          Not a user yet? <Link to="/register"> Register </Link> Now!
        </p>
      </div>
      <div className="my-2">
        <p>
          Forgot Password? <Link to="/forgot"> YUP </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
