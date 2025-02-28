import React, { useState } from "react";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30); // Timer countdown

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      setEmailSent(true); // ✅ Show confirmation message
      toast.success("If an account exists, a reset email has been sent.");
      handleResendCooldown(); // Start cooldown for the resend button
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // ✅ Disable Resend Email button for 30 seconds
  const handleResendCooldown = () => {
    setResendDisabled(true);
    setCountdown(30);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };


  return (
    <div className="container d-flex col justify-content-center align-items-center">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "500px", width: "100%" }}>
    <h2>Forgot Password</h2>

    {!emailSent ? (
      // ✅ Show the "Forgot Password" form
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Enter your email</label>
          <input
            type="email"
            className="form-control shadow-sm p-3 mb-3 bg-white rounded"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-primary">Send Reset Email</button>
      </form>
    ) : (
      // ✅ Show "Email Sent" Confirmation
      <div className="alert alert-success mt-4">
        <h5>Reset Email Sent! 📩</h5>
        <p>
          If an account exists with <strong>{email}</strong>, you will receive a reset link shortly.
          Be sure to check your spam folder!
        </p>
        <p>Didn't get the email? Click below to resend it.</p>
        <button
          className={resendDisabled ? "btn btn-danger" : "btn btn-success"}
          onClick={handleSubmit}
          disabled={resendDisabled}
        >
          {resendDisabled ? `Resend in ${countdown}s ⏳` : "Resend Email"}
        </button>
      </div>
    )}
    </div>
  </div>
  );
};

export default ForgotPassword;
