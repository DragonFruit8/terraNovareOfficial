import React, { useState } from "react";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState("bug");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter your feedback before submitting.");
      return;
    }

    try {
      await axiosInstance.post("/feedback/submit", {
        feedbackType,
        message,
        email,
      });

      toast.success("✅ Feedback submitted successfully!");
      setFeedbackType("bug");
      setMessage("");
      setEmail("");
    } catch (error) {
      console.error("❌ Error submitting feedback:", error.response?.data || error.message);
      toast.error("❌ Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Submit Feedback 📝</h2>
      <p>We appreciate your feedback! Let us know about any bugs, suggestions, or general comments.</p>

      <form onSubmit={handleSubmit} className="mt-4">
        {/* ✅ Feedback Type Selection */}
        <label className="form-label">Select Feedback Type:</label>
        <select
          className="form-select mb-3"
          value={feedbackType}
          onChange={(e) => setFeedbackType(e.target.value)}
        >
          <option value="bug">🐞 Report a Bug</option>
          <option value="feature">💡 Feature Request</option>
          <option value="general">✍️ General Feedback</option>
        </select>

        {/* ✅ Feedback Message Input */}
        <label className="form-label">Your Feedback:</label>
        <textarea
          className="form-control mb-3"
          rows="4"
          placeholder="Describe the issue or share your thoughts..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        {/* ✅ Email Input (Optional) */}
        <label className="form-label">Your Email (Optional):</label>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter your email if you'd like a response"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ✅ Submit Button */}
        <button className="btn btn-primary" type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default Feedback;
