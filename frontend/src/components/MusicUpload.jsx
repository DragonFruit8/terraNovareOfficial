import React, { useState } from "react";
import jwtDecode from "jwt-decode";
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
  
    const token = sessionStorage.getItem("token");
    console.log("🔑 Token from sessionStorage:", token);
  
    if (!token) {
      setMessage("You must be logged in to upload.");
      return;
    }
  
    let user_email = "";
  
    try {
      const user = jwtDecode(token); // ✅ Decode safely using `jwt-decode`
      console.log("🛠️ Decoded user:", user);
      user_email = user.email;
    } catch (error) {
      console.error("🚨 Token decoding error:", error);
      setMessage("Authentication error. Please log in again.");
      return;
    }
  
    if (!user_email) {
      setMessage("Invalid user session.");
      return;
    }
  
    const formData = new FormData();
    formData.append("files", file);
    formData.append("user_email", user_email);
  
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
  
      console.log("✅ Upload successful:", response.data);
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
