import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/auth/reset-password", { token: searchParams.get("token"), newPassword });
      toast.success("Password updated! Please log in.");
      navigate("/login");
    } catch {
      toast.error("Invalid or expired reset link.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="form-control mb-3" />
        <button className="btn btn-primary">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
