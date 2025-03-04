import React, { useState } from "react";
import axiosInstance from "../api/axios.config";

const MusicUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


const handleUpload = async (e) => {
  e.preventDefault();
  if (!file) {
    setMessage("Please select a file to upload.");
    return;
  }

  const token = sessionStorage.getItem("token"); // ✅ Ensure token exists
  if (!token) {
    setMessage("You must be logged in to upload.");
    return;
  }

  // 🔥 Decode JWT token to get `user_email`
  const user = JSON.parse(atob(token.split(".")[1])); // Decode JWT
  const user_email = user?.email; // ✅ Extract user email

  console.log("🛠️ Extracted user_email:", user_email); // ✅ Debugging

  if (!user_email) {
    setMessage("Invalid user session.");
    return;
  }

  const formData = new FormData();
  formData.append("files", file);
  formData.append("user_email", user_email); // ✅ Must be included

  // ✅ Debugging: Check the form data before sending
  for (let pair of formData.entries()) {
    console.log(`🔍 FormData Key: ${pair[0]}, Value: ${pair[1]}`);
  }

  setUploading(true);

  try {
    const response = await axiosInstance.post("/api/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Upload successful:", response.data); // ✅ Debugging
    setMessage(response.data.message);
  } catch (error) {
    console.error("🚨 Upload error:", error);
    setMessage("Failed to upload file.");
  } finally {
    setUploading(false);
  }
};


return (
	<div className="container mt-4">
      <h3>Upload Music</h3>
      <form onSubmit={handleUpload}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit" className="btn btn-primary mt-2" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default MusicUpload;
