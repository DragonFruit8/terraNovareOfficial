import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});
  const token = searchParams.get("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password2 !== formData.password) {
      newErrors.password2 = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (!token) {
        toast.error("Invalid reset link.");
        return;
      }

      await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword: formData.password,
      });

      toast.success("Password updated! Please log in.");
      navigate("/login");
    } catch {
      toast.error("Invalid or expired reset link.");
    }
  };

  return (
    <div id="main-content" className="container d-flex justify-content-center mt-5">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "500px", width: "100%" }}>
      <h2 aria-hidden="false" >Reset Password</h2>
      <form onSubmit={handleSubmit}>
        {/* ✅ Password Field */}
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control shadow-sm p-3 mb-2 bg-white rounded"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoFocus
          />
          {errors.password && <small className="text-danger">{errors.password}</small>}
        </div>

        {/* ✅ Confirm Password Field */}
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control shadow-sm p-3 mb-2 bg-white rounded"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
          />
          {errors.password2 && <small className="text-danger">{errors.password2}</small>}
        </div>

        <button className="btn btn-primary">Reset Password</button>
      </form>
    </div>
    </div>
  );
};

export default ResetPassword;
