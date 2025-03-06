import React, { useState } from "react";
import axiosInstance from "../api/axios.config";
import { Link } from "react-router-dom";

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
  

  const [artistInput, setArtistInput] = useState("");

  const genresList = [
    "Hip-Hop", "EDM", "Rock", "Pop", "House", "Techno", "Reggae", "R&B"
];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFeatureToggle = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleArtistInputChange = (e) => setArtistInput(e.target.value);

  const handleArtistAdd = (e) => {
    if (e.key === "Enter" && artistInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        artists: [...prev.artists, artistInput.trim()],
      }));
      setArtistInput("");
      e.preventDefault();
    }
  };

  const handleArtistRemove = (artist) => {
    setFormData((prev) => ({
      ...prev,
      artists: prev.artists.filter((a) => a !== artist),
    }));
  };

  const calculateQuote = () => {
    const hourlyRate = 50.0;
    const mileageRate = 0.7;
    const setupFee = 50.0;
    const hours = parseFloat(formData.hours) || 0;
    const distance = parseFloat(formData.distance) || 0;
    return (hourlyRate * hours + mileageRate * distance + setupFee).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const estimatedQuote = calculateQuote(); // ✅ Still included in email but NOT displayed

    try {
      await axiosInstance.post("/forms/dj", { ...formData, estimatedQuote });
      alert("🎵 Booking request sent successfully!");
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
    } catch (error) {
      console.error("❌ Error sending request:", error);
      alert("Failed to send request.");
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-4">🎧 Book DJ Services</h2>
      <Link to={"/next#bottom"} className="btn btn-primary my-1">
      Preview music before booking
    </Link>
      <form onSubmit={handleSubmit} className="row text-start gap-2 fw-bold">
        <label>Event Type</label>
        <select className="form-control" name="eventType" value={formData.eventType} onChange={handleChange} required>
          <option value="">Select an Event Type</option>
          <option value="Wedding">Wedding</option>
          <option value="Club">Club</option>
          <option value="Private Party">Private Party</option>
          <option value="Corporate Event">Corporate Event</option>
        </select>

        <label>Event Date</label>
        <input type="date" className="form-control" name="eventDate" value={formData.eventDate} onChange={handleChange} required />

        <label>Venue</label>
        <input type="text" className="form-control" name="venue" value={formData.venue} onChange={handleChange} required />

        <label>Organizer Name</label>
        <input type="text" className="form-control" name="organizer" value={formData.organizer} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />

        <label>Phone</label>
        <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Event Notes</label>
        <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange} placeholder="Any special requests or additional details?"></textarea>

        <label>Preferred Music Genres</label>
        <div className="d-flex flex-wrap">
          {genresList.map((genre) => (
            <button
              type="button"
              key={genre}
              className={`btn m-1 ${formData.genres.includes(genre) ? "btn-success" : "btn-outline-danger"}`}
              onClick={() => handleFeatureToggle(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <label>Preferred Artists</label>
        <input
          type="text"
          className="form-control"
          value={artistInput}
          onChange={handleArtistInputChange}
          onKeyPress={handleArtistAdd}
          placeholder="Type artist name and press Enter"
        />
        <div className="d-flex flex-wrap mt-2">
          {formData.artists.map((artist, index) => (
            <span key={index} className="badge bg-primary m-1 p-2">
              {artist}{" "}
              <button
                type="button"
                className="btn btn-sm btn-danger ms-2"
                onClick={() => handleArtistRemove(artist)}
              >
                x
              </button>
            </span>
          ))}
        </div>

        <label>Estimated Performance Hours</label>
        <input type="number" className="form-control" name="hours" value={formData.hours} onChange={handleChange} required />

        <label>Travel Distance (miles)</label>
        <input type="number" className="form-control" name="distance" value={formData.distance} onChange={handleChange} required />

        <button type="submit" className="btn btn-success mt-3">🎶 Submit Booking Request</button>
      </form>
    </div>
  );
};

export default DJServiceForm;
