import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import ReCAPTCHA from "react-google-recaptcha";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const Login = () => {
  const recaptchaRef = useRef(null);
  const { setUserData } = useUser(); // ✅ Get `loginUser` from context
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      if (!recaptchaRef.current) {
        throw new Error("⚠️ reCAPTCHA not loaded.");
      }
  
      const recaptchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
  
      console.log("🔹 Sending login request:", { email, password, recaptchaToken });
  
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
        recaptchaToken, // ✅ Ensure we send reCAPTCHA token
      });
  
      if (!response || !response.data) {
        throw new Error("⚠️ Server returned an empty response.");
      }
  
      console.log("✅ Login Success:", response.data);
  
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        setUserData(response.data.user);
      }
  
      toast.success("🎉 Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error("❌ Login failed:", error);
  
      let errorMessage = "⚠️ An unexpected error occurred.";
  
      if (error.response && error.response.data) {
        console.log("🔍 Server Response:", error.response);
        errorMessage = error.response.data.error || "Login failed. Please check credentials.";
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      toast.error(errorMessage);
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
          {/* Invisible reCAPTCHA */}
          <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              size="invisible"
              ref={recaptchaRef}
            />

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <div className="d-flex text-center justify-content-center mt-2 gap-3">
          <p>
            <Link to="/register" className="text-primary">
              Register
            </Link>
            </p>
            <p>
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
