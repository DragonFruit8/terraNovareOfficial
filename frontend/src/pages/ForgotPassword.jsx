import React, { useState } from "react";
import { Link } from "react-router-dom"
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/auth/forgot-password", { email });
      toast.success("Reset link sent! Check your email.");
    } catch {
      toast.error("Error sending reset link!");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="form-control mb-3" />
        <button className="btn btn-primary">Send Reset Link</button>
        <div className="my-2">
        <Link to="/login">Login Page</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
