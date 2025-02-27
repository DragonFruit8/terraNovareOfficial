import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axiosInstance from "../api/axios.config";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
// import toast from "react-hot-toast";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit, // ✅ Re-enable handleSubmit
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "", //
    lastName: "", //
    email: "",
    password: "",
    password2: "",
  });

  const password = watch("password");

  // ✅ Check Username Availability
  const [usernameError, setUsernameError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  // ✅ Add `handleChange` function
  if (userData) {
    // Console.log("User is already logged in:", userData);
  }
  // ✅ Handle Input Change
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "username") {
      try {
        const response = await axiosInstance.post("/auth/check-username", {
          username: value,
        });
        setUsernameError(
          response.data.available ? "" : "Username is already taken."
        );
      } catch (error) {
        setUsernameError("Error checking username.");
      }
    }
  };

  const checkUsernameAvailability = async (username) => {
    setIsCheckingUsername(true); // ✅ Start checking
    try {
      setIsCheckingUsername(true);
      const response = await axiosInstance.post("/auth/check-username", { username });

      if (!response.data.available) {
        setError("username", {
          type: "manual",
          message: "Username is already taken.",
        });
        return false; // Prevent form submission
      } else {
        clearErrors("username"); // ✅ Clears error when username is available
        return true;
      }
    } catch (error) {
      console.error("❌ Error checking username:", error.response?.data || error.message);
      setError("username", {
        type: "manual",
        message: "Could not verify username availability.",
      });
      return false;
    } finally {
      setIsCheckingUsername(false); // ✅ Stop checking
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("All fields are required.");
      return;
    }
    if (usernameError) {
      toast.error(usernameError);
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim(); // ✅ Combine first & last name
    const userData = {
      username: formData.username,
      fullname: fullName, // ✅ Send combined name
      email: formData.email,
      password: formData.password,
    };

    setIsLoading(true);
    try {
      // Console.log("Sending Data to Backend:", JSON.stringify(userData)); // ✅ Debugging
      await axiosInstance.post("/auth/signup", userData);
      toast.success("Signup successful!");
      navigate("/login"); // ✅ Redirect to Homepage
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.error || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center mt-5">
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-center">Create an Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              type="text"
              name="username"
              value={formData.username}
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 4,
                  message: "Username must be at least 4 characters",
                },
                validate: async (value) =>
                  await checkUsernameAvailability(value), // ✅ Integrated
              })}
              onBlur={(e) => checkUsernameAvailability(e.target.value)} // ✅ Validate on blur
              onChange={handleChange} // ✅ Live validation
              autoFocus
            />
      {/* ✅ Show loading indicator while checking username */}
      {isCheckingUsername && <small className="text-primary">Checking username...</small>}

      {/* ✅ Show error if username is taken */}
      {errors.username && <small className="text-danger">{errors.username.message}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control shadow-sm p-3 mb-5 bg-white rounded"
              type="email"
              name="email"
              autoComplete="on"
              value={formData.email} // ✅ Sync with state
              {...register("email", {
                required: "Email required",
                pattern: {
                  // eslint-disable-next-line
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                  message: "Email not valid",
                },
              })}
              onChange={handleChange} // ✅ Add onChange
            />
            {errors.email && (
              <small className="text-danger">{errors.email.message}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control shadow-sm p-3 mb-5 bg-white rounded"
              name="password"
              value={formData.password} // ✅ Sync with state
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              onChange={handleChange} // ✅ Add onChange
            />
            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control shadow-sm p-3 mb-5 bg-white rounded"
              name="password2"
              value={formData.password2} // ✅ Sync with state
              {...register("password2", {
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              onChange={handleChange} // ✅ Add onChange
            />
            {errors.password2 && (
              <small className="text-danger">{errors.password2.message}</small>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
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
