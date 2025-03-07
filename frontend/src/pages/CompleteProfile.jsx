import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const CompleteProfile = () => {
  const { userData, setUserData } = useUser();
  const navigate = useNavigate();

  // ✅ Lazy Initialization of Form State
  const initialProfileData = {
    address: userData?.address || "",
    city: userData?.city || "",
    state: userData?.state || "",
    country: userData?.country || "",
  };

  const [profileData, setProfileData] = useState(initialProfileData);
  const [loading, setLoading] = useState(false);

  // ✅ Sync state only if userData changes
  useEffect(() => {
    if (userData) {
      setProfileData({
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        country: userData.country || "",
      });
    }
  }, [userData]);

  // ✅ Handle Input Changes Efficiently
  const handleChange = (e) => {
    setProfileData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Handle Profile Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token"); // ✅ Get token from sessionStorage
  
    if (!token) {
      toast.error("Session expired. Please log in again.");
      return navigate("/login");
    }
  
    try {
      const response = await axiosInstance.put("/user/update-profile", profileData, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Send token
      });
      setLoading(true)
      setUserData(response.data);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("❌ Error updating profile:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 aria-hidden="false" >Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        {["address", "city", "state", "country"].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              className="form-control"
              name={field}
              value={profileData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
