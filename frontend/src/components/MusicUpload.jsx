import React, { useState } from "react";
import axiosInstance from "../api/axios.config";

const MusicUpload = ({ fetchMusicFiles }) => { // ✅ Ensure fetchMusicFiles is passed as a prop
  const [uploadMessage, setUploadMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // ✅ Track selected file

  // ✅ Capture file selection and reset message
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // ✅ Store the selected file
      setUploadMessage(""); // ✅ Reset upload message
    }
  };

  // ✅ Handle Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("❌ Please select a file before uploading.");
      return;
    }
  
    const formData = new FormData();
    formData.append("music", selectedFile);
  
    try {
      const { data } = await axiosInstance.post("/upload-music", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (data.success) { // ✅ Checks if response has { success: true }
        console.log("✅ Upload Success:", data);
        setUploadMessage("✅ Upload successful!");
        fetchMusicFiles(); // ✅ Refresh song list after upload
        setSelectedFile(null);
      } else {
        console.error("❌ Upload Error:", data.error);
        setUploadMessage(`❌ Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error("❌ Upload Error:", error.response?.data || error.message);
      setUploadMessage("❌ Upload failed. Please try again.");
    }
  };
  
  return (
    <div className="upload-container">
      <input type="file" accept="audio/*" onChange={handleFileChange} /> {/* ✅ Handles file selection */}
      <button onClick={handleUpload} disabled={!selectedFile}>📤 Upload</button> {/* ✅ Upload only if file is selected */}
      {uploadMessage && <p className="message">{uploadMessage}</p>}
    </div>
  );
};

export default MusicUpload;
