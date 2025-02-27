import React, { useState } from "react";
import axiosInstance from "../api/axios.config";

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
  });

  const [currentArtist, setCurrentArtist] = useState("");

  const genresList = ["Hip-Hop", "Trance", "EDM", "Jazz", "Rock", "Pop", "Reggae", "House", "Techno"];

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle genre selection (toggle selection)
  const handleGenreToggle = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  // Handle artist input and add to list
  const handleAddArtist = (e) => {
    if (e.key === "Enter" && currentArtist.trim()) {
      setFormData({ ...formData, artists: [...formData.artists, currentArtist.trim()] });
      setCurrentArtist("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/forms/dj", formData);
      alert("Booking request sent successfully!");
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
      });
    } catch (error) {
      console.error("Error sending email", error);
      alert("Failed to send request.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Book DJ Services</h2>
      <form onSubmit={handleSubmit}>

        {/* Event Type Dropdown */}
        <label>Event Type</label>
        <select className="form-control" name="eventType" value={formData.eventType} onChange={handleChange}>
          <option value="">Select an Event Type</option>
          <option value="Wedding">Wedding</option>
          <option value="Club">Club</option>
          <option value="Private Party">Private Party</option>
          <option value="Corporate Event">Corporate Event</option>
        </select>

        {/* Date Picker */}
        <label>Event Date</label>
        <input type="date" className="form-control" name="eventDate" value={formData.eventDate} onChange={handleChange} />

        {/* Genre Selection */}
        <label>Music Genres</label>
        <div className="d-flex flex-wrap">
          {genresList.map((genre) => (
            <button
              type="button"
              key={genre}
              className={`btn m-1 ${formData.genres.includes(genre) ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => handleGenreToggle(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Artist Preferences (Dynamic Input List) */}
        <label>Preferred Artists</label>
        <input
          type="text"
          className="form-control"
          value={currentArtist}
          onChange={(e) => setCurrentArtist(e.target.value)}
          onKeyDown={handleAddArtist}
          placeholder="Type an artist name and press Enter"
        />
        <ul>
          {formData.artists.map((artist, index) => (
            <li key={index}>{artist}</li>
          ))}
        </ul>

        {/* Venue & Contact Information */}
        <label>Event Venue</label>
        <input type="text" className="form-control" name="venue" value={formData.venue} onChange={handleChange} />

        <label>Organizer Name</label>
        <input type="text" className="form-control" name="organizer" value={formData.organizer} onChange={handleChange} />

        <label>Email</label>
        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />

        <label>Phone Number</label>
        <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />

        {/* Additional Notes */}
        <label>Additional Notes</label>
        <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange} />

        <button type="submit" className="btn btn-success mt-3">Submit Booking Request</button>
      </form>
    </div>
  );
};

export default DJServiceForm;
