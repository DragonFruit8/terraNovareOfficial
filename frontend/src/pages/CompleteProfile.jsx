import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const CompleteProfile = () => {
  const { userData, setUserData } = useUser();
  const navigate = useNavigate();

  // Initialize form state
  const [profileData, setProfileData] = useState({
    address: userData?.address || "",
    city: userData?.city || "",
    state: userData?.state || "",
    country: userData?.country || "",
  });

  // Synchronize local state when userData changes
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

  // Handle input change events
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Submit the form to update the profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Await the API call to ensure response is received before proceeding
      const response = await axiosInstance.put("/user/update-profile", {
        username: userData.username,
        fullname: userData.fullname,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        country: profileData.country,
      });
      setUserData(response.data); // Update user context with the new data
      toast.success("Profile updated successfully!");
      navigate("/profile"); // Redirect to the profile page
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={profileData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={profileData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">State</label>
          <input
            type="text"
            className="form-control"
            name="state"
            value={profileData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            type="text"
            className="form-control"
            name="country"
            value={profileData.country}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
