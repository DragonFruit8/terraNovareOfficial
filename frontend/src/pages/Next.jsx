import React, { useState } from "react";
import axiosInstance from "../api/axios.config";
import { Link } from "react-router-dom";
import { getZipDistance } from "../utils/getLatLng"; // Ensure this utility exists

const DJServiceForm = () => {
  const [formData, setFormData] = useState({
    eventType: "",
    eventDate: "",
    genres: [], // ✅ Used for genre selection
    artists: [], // ✅ Used for artist selection
    venue: "",
    organizer: "",
    email: "",
    phone: "",
    notes: "",
    hours: "",
    zip1: "", // User's ZIP
    zip2: "", // Event ZIP
    distance: "", // Auto-calculated
  });

  const [artistInput, setArtistInput] = useState("");
  const [calculatingDistance, setCalculatingDistance] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const genresList = ["Hip-Hop", "EDM", "Rock", "Pop", "House", "Techno", "Reggae", "R&B"];

  // ✅ Calculate distance based on ZIP codes
  const handleCalculateDistance = async () => {
    if (!formData.zip1 || !formData.zip2) {
      setErrorMessage("Please enter both ZIP codes.");
      return;
    }

    setCalculatingDistance(true);
    setErrorMessage("");

    try {
      const result = await getZipDistance(formData.zip1, formData.zip2);
      if (result) {
        setFormData((prev) => ({ ...prev, distance: result }));
      } else {
        setErrorMessage("Error calculating distance. Please try again.");
      }
    } catch (error) {
      console.error("❌ Distance Calculation Error:", error);
      setErrorMessage("Failed to calculate distance.");
    } finally {
      setCalculatingDistance(false);
    }
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle genre selection
  const toggleGenre = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  // ✅ Handle artist input
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

  // ✅ Calculate the quote based on distance & hours
  const calculateQuote = () => {
    const hourlyRate = 50.0;
    const mileageRate = 0.7;
    const setupFee = 50.0;
    const hours = parseFloat(formData.hours) || 0;
    const distance = parseFloat(formData.distance) || 0;

    return (hourlyRate * hours + mileageRate * distance + setupFee).toFixed(2);
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.distance) {
      alert("Please calculate distance before submitting.");
      return;
    }

    const estimatedQuote = calculateQuote();

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
        zip1: "",
        zip2: "",
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

        <label>Your ZIP Code</label>
        <input type="text" className="form-control" name="zip1" value={formData.zip1} onChange={handleChange} required />

        <label>Event ZIP Code</label>
        <input type="text" className="form-control" name="zip2" value={formData.zip2} onChange={handleChange} required />

        <button type="button" className="btn btn-info mt-2" onClick={handleCalculateDistance}>
          {calculatingDistance ? "Calculating..." : "Calculate Distance"}
        </button>

        {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
        {formData.distance && <p className="text-success mt-2">Estimated Distance: {formData.distance} miles</p>}

        <label>Preferred Music Genres</label>
        <div className="d-flex flex-wrap">
          {genresList.map((genre) => (
            <button
              type="button"
              key={genre}
              className={`btn m-1 ${formData.genres.includes(genre) ? "btn-success" : "btn-outline-danger"}`}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <label>Preferred Artists</label>
        <input type="text" className="form-control" value={artistInput} onKeyPress={handleArtistAdd} placeholder="Type artist name and press Enter" />
        <div className="d-flex flex-wrap mt-2">
          {formData.artists.map((artist, index) => (
            <span key={index} className="badge bg-primary m-1 p-2">
              {artist}{" "}
              <button type="button" className="btn btn-sm btn-danger ms-2" onClick={() => handleArtistRemove(artist)}>
                x
              </button>
            </span>
          ))}
        </div>

        <label>Estimated Performance Hours</label>
        <input type="number" className="form-control" name="hours" value={formData.hours} onChange={handleChange} required />

        <p className="fw-bold mt-3">💰 Estimated Quote: <span className="text-success">${calculateQuote()}</span></p>

        <button type="submit" className="btn btn-success mt-3">🎶 Submit Booking Request</button>
      </form>
    </div>
  );
};

export default DJServiceForm;
