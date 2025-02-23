import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const UploadComponent = () => {
  const [files, setFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Allowed file types
  const acceptedFileTypes = {
    "audio/mp3": [".mp3"],
    "application/pdf": [".pdf"],
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
    "video/mp4": [".mp4"],
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  // Use Dropzone for handling file uploads
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: Object.keys(acceptedFileTypes).join(","), // Restrict to allowed types
  });

  const removeFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload successful:", response.data);
      setUploadSuccess("Files uploaded successfully!");
      setFiles([]); // Clear file list after upload
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadSuccess("Upload failed. Please try again.");
    }
  };

  return (
    <div className="upload-container">
      {/* Drag & Drop Area */}
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & drop files here, or click to select</p>
      </div>

      {/* File List Display */}
      <div className="file-list">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <span>
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </span>
            <button onClick={() => removeFile(file.name)}>Remove</button>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      {files.length > 0 && (
        <button onClick={uploadFiles} className="upload-btn">
          Upload
        </button>
      )}

      {/* Upload Feedback */}
      {uploadSuccess && <p className="upload-message">{uploadSuccess}</p>}
    </div>
  );
};

export default UploadComponent;
