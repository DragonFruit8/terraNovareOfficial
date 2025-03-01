import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const Register = () => {
  const recaptchaRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(""); // ✅ Stores PostgreSQL error
  const [usernameStatus, setUsernameStatus] = useState("idle"); // "idle" | "checking" | "available" | "taken"

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm({ mode: "onBlur" });

  const password = watch("password");
  const confirmPassword = watch("password2"); // ✅ Watch second password field

  // ✅ Password match validation (green if match, red if not)
  const getPasswordMatchClass = () => {
    if (!confirmPassword) return ""; // No color when empty
    return confirmPassword === password ? "is-valid" : "is-invalid";
  };

  // ✅ Reworked Username Validation
  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 4) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");

    clearTimeout(window.usernameCheckTimeout); // 🔹 Clears previous request
    window.usernameCheckTimeout = setTimeout(async () => {
      try {
        const response = await axiosInstance.post("/auth/check-username", {
          username,
        });

        if (response.data.available) {
          setUsernameStatus("available");
          clearErrors("username");
        } else {
          setUsernameStatus("taken");
          setError("username", {
            type: "manual",
            message: "Username is already taken.",
          });
        }
      } catch (error) {
        console.error(
          "❌ Error checking username:",
          error.response?.data || error.message
        );
        setUsernameStatus("idle");
        setError("username", {
          type: "manual",
          message: "Could not verify username.",
        });
      }
    }, 500); // 🔹 Delays API request by 500ms
  };

  // ✅ Form Submission
  const onSubmit = async (data) => {
    console.log("📡 Sending signup request...");
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    // 🔹 Validate Username Status
    if (usernameStatus === "checking") return toast.error("Please wait for username validation.");
    if (usernameStatus === "taken") return toast.error("Username is already taken.");
  
    // 🔹 Validate Passwords
    if (password !== confirmPassword) return toast.error("Passwords do not match.");
    if (!passwordRegex.test(password)) {
      return toast.error("Password must be at least 8 characters, include a number and a special character.");
    }
  
    try {
      // 🔹 Get reCAPTCHA Token
      setIsLoading(true);
      console.log("⚡ Getting reCAPTCHA token...");
      const token = await recaptchaRef.current.executeAsync();
      console.log("✅ Got reCAPTCHA token:", token);
      recaptchaRef.current.reset();
  
      // 🔹 Construct User Data
      const userData = {
        username: data.username,
        fullname: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        password: data.password,
        recaptchaToken: token,
      };
  
      // 🔹 API Call
      setServerError("");
      await axiosInstance.post("/auth/signup", userData);
      console.log("✅ Signup request completed.");
      toast.success("Signup successful!");
      navigate("/login");
    } catch (error) {
      console.error("❌ Signup error:", error.response?.data || error.message);
      
      const errorMsg = error.response?.data?.error || "Signup failed. Please try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container d-flex col align-items-center justify-content-center my-5">
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-center">Create an Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* ✅ Username Field */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              type="text"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 4,
                  message: "Username must be at least 4 characters",
                },
              })}
              onBlur={(e) => checkUsernameAvailability(e.target.value)}
              autoFocus
            />
            {usernameStatus === "checking" && (
              <small className="text-info">Checking username...</small>
            )}
            {usernameStatus === "taken" && (
              <small className="text-danger">Username is taken.</small>
            )}
            {usernameStatus === "available" && (
              <small className="text-success">✅ Username is available!</small>
            )}
          </div>

          {/* ✅ First Name */}
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && (
              <small className="text-danger">{errors.firstName.message}</small>
            )}
          </div>

          {/* ✅ Last Name */}
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && (
              <small className="text-danger">{errors.lastName.message}</small>
            )}
          </div>

          {/* ✅ Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {/* ✅ Display PostgreSQL Error Message */}
            {serverError && (
              <div className="alert alert-danger mt-2">
                <i className="bi bi-exclamation-triangle-fill"></i>{" "}
                {serverError}
              </div>
            )}
          </div>

          {/* ✅ Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
            )}
          </div>

          {/* ✅ Confirm Password - Changes color based on match */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${getPasswordMatchClass()}`}
              {...register("password2", {
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {confirmPassword && confirmPassword === password ? (
              <small className="text-success">✅ Passwords match!</small>
            ) : confirmPassword ? (
              <small className="text-danger">❌ Passwords do not match</small>
            ) : null}
                      <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              size="invisible"
              ref={recaptchaRef}
            />
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading || usernameStatus === "checking"}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
