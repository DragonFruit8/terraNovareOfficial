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
  const [artistInput, setArtistInput] = useState("");

  const genresList = [
    "Hip-Hop", "EDM", "Rock", "Pop", "Jazz", "House", "Techno", "Reggae", "R&B", "Classical"
  ];
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(feature)
        ? prev.genres.filter((f) => f !== feature)
        : [...prev.genres, feature],
    }));
  };

  const handleArtistInputChange = (e) => {
    setArtistInput(e.target.value);
  };

  const handleArtistAdd = (e) => {
    if (e.key === "Enter" && artistInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        artists: [...prev.artists, artistInput.trim()],
      }));
      setArtistInput("");
      e.preventDefault(); // Prevent form submission on Enter
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

        <label>Preferred Music Genres</label>
        <div className="d-flex flex-wrap">
          {genresList.map((genre) => (
            <button type="button" key={genre} className={`btn m-1 ${formData.genres.includes(genre) ? "btn-success" : "btn-outline-danger"}`} onClick={() => handleFeatureToggle(genre)}>
              {genre}
            </button>
          ))}
        </div>

        <label>Preferred Artists</label>
        <input type="text" className="form-control" value={artistInput} onChange={handleArtistInputChange} onKeyPress={handleArtistAdd} placeholder="Type artist name and press Enter" />
        <div className="d-flex flex-wrap mt-2">
          {formData.artists.map((artist, index) => (
            <span key={index} className="badge bg-primary m-1 p-2">
              {artist} <button type="button" className="btn btn-sm btn-danger ms-2" onClick={() => handleArtistRemove(artist)}>x</button>
            </span>
          ))}
        </div>

        <button type="submit" className="btn btn-success mt-3">Submit Booking Request</button>
      </form>
    </div>
  );
};

export default DJServiceForm;

