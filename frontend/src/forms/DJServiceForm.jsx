import React, { useState } from "react";
import axiosInstance from "../api/axios.config";
import { useNavigate } from "react-router-dom";

const DJServiceForm = () => {
  const [formData, setFormData] = useState({
    eventType: "",
    eventDate: "",
    genres: [],
    artists: [],
    venue: "",
    organizer: "",
    email: "",
    phone: "",
    notes: "",
    hours: "",
    distance: "",
  });

  const [quote, setQuote] = useState(null);

  const genresList = [
    "Hip-Hop",
    "EDM",
    "Rock",
    "Pop",
    "Jazz",
    "House",
    "Techno",
    "Reggae",
    "R&B",
    "Classical",
  ];
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      genres: checked
        ? [...prev.genres, value]
        : prev.genres.filter((genre) => genre !== value),
    }));
  };

  const calculateQuote = () => {
    const hourlyRate = 50.0;
    const mileageRate = 0.7;
    const setupFee = 50.0;

    const hours = parseFloat(formData.hours) || 0;
    const distance = parseFloat(formData.distance) || 0;

    const totalCost = hourlyRate * hours + mileageRate * distance + setupFee;
    setQuote(totalCost.toFixed(2));

    return totalCost.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const estimatedQuote = calculateQuote();

    try {
      await axiosInstance.post("/forms/dj", { ...formData, estimatedQuote });
      alert("Booking request sent successfully!");

      // Reset form
      setFormData({
        eventType: "",
        eventDate: "",
        genres: [],
        artists: [],
        venue: "",
        organizer: "",
        email: "",
        phone: "",
        notes: "",
        hours: "",
        distance: "",
      });

      setQuote(null);
    } catch (error) {
      console.error("Error sending email", error);
      alert("Failed to send request.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Book DJ Services</h2>
      <form onSubmit={handleSubmit}>
        {/* Navigate to Music Player */}
        <div className="d-flex row justify-content-center align-items-center">
        <p className="lead">Before you book me...</p>
        <button onClick={() => navigate("/next", { state: { scrollToBottom: true } })} className="btn btn-info my-1">
          🎵 Check Out my Music
        </button>
        </div>
        {/* Event Type */}
        <label>Event Type</label>
        <select
          className="form-control"
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          required
        >
          <option value="">Select an Event Type</option>
          <option value="Wedding">Wedding</option>
          <option value="Club">Club</option>
          <option value="Private Party">Private Party</option>
          <option value="Corporate Event">Corporate Event</option>
        </select>

        {/* Event Date */}
        <label>Event Date</label>
        <input
          type="date"
          className="form-control"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          required
        />

        {/* Genres */}
        <label>Preferred Music Genres</label>
        <div className="form-group">
          {genresList.map((genre) => (
            <div key={genre} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                value={genre}
                checked={formData.genres.includes(genre)}
                onChange={handleGenreChange}
              />
              <label className="form-check-label">{genre}</label>
            </div>
          ))}
        </div>

        {/* Hours */}
        <label>Hours of DJ Service</label>
        <input
          type="number"
          className="form-control"
          name="hours"
          value={formData.hours}
          onChange={handleChange}
          placeholder="Number of hours"
          required
        />

        {/* Distance */}
        <label>Distance (miles)</label>
        <input
          type="number"
          className="form-control"
          name="distance"
          value={formData.distance}
          onChange={handleChange}
          placeholder="Enter travel distance"
          required
        />

        {/* Estimated Quote Display */}
        {quote !== null && (
          <div className="alert alert-info mt-3">
            <strong>Estimated Cost: ${quote}</strong>
          </div>
        )}

        {/* Contact Info */}
        <label>Event Venue</label>
        <input
          type="text"
          className="form-control"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          required
        />

        <label>Organizer Name</label>
        <input
          type="text"
          className="form-control"
          name="organizer"
          value={formData.organizer}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          type="tel"
          className="form-control"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        {/* Additional Notes */}
        <label>Additional Notes</label>
        <textarea
          className="form-control"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />

        {/* Submit Button */}
        <button type="submit" className="btn btn-success mt-3">
          Submit Booking Request
        </button>
      </form>

      {/* Calculate Quote Button */}
      <button onClick={calculateQuote} className="btn btn-primary mt-3">
        Calculate Quote
      </button>
    </div>
  );
};

export default DJServiceForm;
