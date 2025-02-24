import React, { useState, useEffect } from "react";
// import axios from "axios";
import '../UnderConstruction.css'

const UnderConstruction = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputPassword, setInputPassword] = useState(""); // ✅ Ensure state exists
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Check local storage for saved access
  useEffect(() => {
    if (localStorage.getItem("uc_access") === "granted") {
      setIsAuthorized(true);
    }
  }, []);

  // ✅ Handle password submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

    fetch("http://localhost:9000/api/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: inputPassword }),
    })
    .then(response => response.json())
    .then(data => {
      console.log("🔹 Server Response:", data);
      setIsAuthorized(true);
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
