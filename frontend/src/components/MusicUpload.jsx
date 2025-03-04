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

    const formData = new FormData();
    formData.append("music", file);

    setUploading(true);
    try {
      const response = await axiosInstance.post("/upload-music", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Failed to upload file.");
    } finally {
      setUploading(false);
      setFile(null);
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
