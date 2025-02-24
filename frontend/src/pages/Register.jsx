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

  // const userEmail = userData?.email || formData.email;

  const password = watch("password");

  // ✅ Add `handleChange` function
  if (userData) {
    // Console.log("User is already logged in:", userData);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData({
      ...formData,
      [name]: name === "email" ? value.toLowerCase() : value, // ✅ Convert email to lowercase
    });
  };

  const onSubmit = async () => {
    if (!formData.username || !formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error("All fields are required.");
      return;
    }
  
    const fullName = `${formData.firstName} ${formData.lastName}`.trim(); // ✅ Combine first & last name
    const userData = {
      username: formData.username,
      fullname: fullName,  // ✅ Send combined name
      email: formData.email,
      password: formData.password,
    };
  
    setIsLoading(true);
    try {
      // Console.log("Sending Data to Backend:", JSON.stringify(userData)); // ✅ Debugging
      await axiosInstance.post("/auth/signup", userData);
      
      // Console.log("Response from Backend:", response.data);
      toast.success("Signup successful!");
      
      navigate("/"); // ✅ Redirect to Homepage
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="text-center">Create an Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control shadow-sm p-3 mb-5 bg-white rounded"
            type="text"
            name="username"
            value={formData.username} // ✅ Sync with state
            {...register("username", {
              minLength: {
                value: 4,
                message: "Username must be greater than 3 characters",
              },
              required: "Username is required",
            })}
            onChange={handleChange} // ✅ Add onChange
          />
          {errors.username && (
            <small className="text-danger">{errors.username.message}</small>
          )}
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
  );
};

export default Register;
