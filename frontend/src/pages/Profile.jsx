import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userData, setUserData } = useUser();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  // const navigate = useNavigate();

  // ✅ Fetch User Data on Mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error("Unauthorized: Please log in again.");
          return;
        }

        const response = await axiosInstance.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
        setFormData(response.data); // ✅ Populate form fields
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        toast.error("Failed to load profile data.");
      }
    };

    fetchUserProfile();
  }, [setUserData]);

  // ✅ Handle Form Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized: Please log in again.");
        return;
      }

      const response = await axiosInstance.put("/user/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data); // ✅ Update user context
      toast.success("Profile updated successfully!");
      setEditMode(false); // ✅ Switch back to view mode
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>

      {/* ✅ View Mode */}
      {!editMode ? (
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">{userData?.fullname}</h4>
            <p className="card-text">
              <strong>Username:</strong> {userData?.username}
            </p>
            <p className="card-text">
              <strong>Email:</strong> {userData?.email}
            </p>
            <p className="card-text">
              <strong>Address:</strong> {userData?.address}
            </p>
            <p className="card-text">
              <strong>City:</strong> {userData?.city}
            </p>
            <p className="card-text">
              <strong>State:</strong> {userData?.state}
            </p>
            <p className="card-text">
              <strong>Country:</strong> {userData?.country}
            </p>
            <p className="card-text">
              <strong>Role:</strong> {Array.isArray(userData?.roles) ? userData.roles.join(", ") : "user"}
            </p>
            <button
              onClick={() => setEditMode(true)}
              className="btn btn-warning mt-3"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        /* ✅ Edit Mode */
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              disabled // ❗ Prevent edits
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullname"
              className="form-control"
              value={formData.fullname}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              disabled // ❗ Prevent email changes
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              className="form-control"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">State</label>
            <input
              type="text"
              name="state"
              className="form-control"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Country</label>
            <input
              type="text"
              name="country"
              className="form-control"
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          {/* ✅ Save and Cancel Buttons */}
          <button type="submit" className="btn btn-primary me-2">
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
