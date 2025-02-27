import React, { useState, useEffect } from "react";
// import axios from "axios";
import '../UnderConstruction.css'

const UnderConstruction = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputPassword, setInputPassword] = useState(""); // ✅ Ensure state exists
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Check local storage for saved access
  useEffect(() => {
    const storedAccess = localStorage.getItem("uc_access");
    const storedTimestamp = localStorage.getItem("uc_access_timestamp");
  
    if (storedAccess === "granted" && storedTimestamp) {
      const now = new Date().getTime();
      const expiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
      if (now - storedTimestamp < expiration) {
        setIsAuthorized(true);
      } else {
        localStorage.removeItem("uc_access");
        localStorage.removeItem("uc_access_timestamp");
      }
    }
  }, []);
  

  // ✅ Handle password submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

    fetch("https://terranovare.tech/api/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: inputPassword }),
    })
    .then(data => {
      console.log("🔹 Server Response:", data);
      if (data.success) {
        localStorage.setItem("uc_access", "granted");
        localStorage.setItem("uc_access_timestamp", new Date().getTime()); // Store current timestamp
        setIsAuthorized(true);
      }
    })    
    .catch(error => console.error("❌ Fetch Error:", error));
  };

  // ✅ If authorized, do not show the construction page
  if (isAuthorized) return null;

  return (
    <div className="under-construction-overlay d-flex align-items-center justify-content-center">
      <div className="under-construction-content text-center p-5 rounded">
        <h1 className="display-4 fw-bold text-warning mb-3 animate-bounce">
          🚧 Under Construction 🚧
        </h1>
        <p className="lead text-light">
          This site is currently being built. Enter the password to proceed.
        </p>

        {/* Password Form */}
        <form onSubmit={handlePasswordSubmit} className="mt-4">
          <input
            type="password"
            className="form-control text-center"
            placeholder="Enter Password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-warning btn-lg mt-3">
            Unlock
          </button>
        </form>

        {/* ✅ Show error message if password is incorrect */}
        {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default UnderConstruction;
