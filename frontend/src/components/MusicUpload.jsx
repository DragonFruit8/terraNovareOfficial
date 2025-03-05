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
      setMessage("❌ Please select a file to upload.");
      return;
    }
  
    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage("⚠️ You must be logged in to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("files", file);
  
    setUploading(true);
    setMessage("");
  
    try {
      const response = await axiosInstance.post("/uploads", formData);
      setMessage(response.data.message || "✅ Upload successful!");
    } catch (error) {
      console.error("🚨 Upload error:", error);
      setMessage("❌ Failed to upload file. Please try again.");
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