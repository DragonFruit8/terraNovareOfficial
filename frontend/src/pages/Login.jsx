import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const Login = () => {
  const { setUserData } = useUser(); // ✅ Get `loginUser` from context
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        // console.log("✅ User logged in, token stored:", response.data.token);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        setUserData(response.data.user); // ✅ Update context state
      }

      toast.success("Logged in successfully!");
      navigate("/"); // ✅ Redirect user after login
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="container d-flex col align-items-center justify-content-center my-5">
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <p>
            <Link to="/register" className="text-primary">
              Register
            </Link>{" "}
            |{" "}
            <Link to="/forgot" className="text-danger">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
