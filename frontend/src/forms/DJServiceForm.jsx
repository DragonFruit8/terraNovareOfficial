import React, { useState, useRef } from "react";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const DJServiceForm = ({ setIsOpen, onSuccess }) => {
  const [formData, setFormData] = useState({
    eventType: "default",
    eventDate: "",
    genres: [],
    artists: [],
    venue: "",
    organizer: "",
    email: "",
    phone: "",
    notes: "",
    zip2: "", // ✅ User's ZIP (only this needs input)
    hours: "",
    distance: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [artistInput, setArtistInput] = useState("");
  const zipTimeoutRef = useRef(null); // ✅ Prevents timeout overwrites

  const genresList = [
    "Dubstep",
    "EDM", 
    "Hip-Hop", 
    "House", 
    "Pop", 
    "R&B",
    "Reggae", 
    "Rock", 
    "Techno", 
    "Trance"
  ];

  // ✅ Calculate distance from `48197` (your location) to `zip2` (user's input)
  const handleCalculateDistance = async (zip2) => {
    if (!zip2 || zip2.length < 5) return; // ✅ Only trigger API if 5+ digits entered

    setErrorMessage("");

    try {
      console.log("🚀 Sending distance request for ZIP:", zip2);

      const response = await axiosInstance.post("/distance", {
        zip1: "48197",
        zip2: zip2,
      });

      console.log("📡 Distance API Response:", response.data);

      if (response.data.error) {
        setErrorMessage(response.data.error);
        setFormData((prev) => ({ ...prev, distance: "" })); // ✅ Reset distance on error
      } else if (response.data.distance) {
        setFormData((prev) => ({ ...prev, distance: response.data.distance }));
        console.log("✅ Distance Set:", response.data.distance);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.error("❌ Error calculating distance:", error.response?.data || error.message);
      setErrorMessage("Error calculating distance. Please try again.");
    }
  };

  // ✅ Debounced ZIP code API calls to reduce excessive requests
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "zip2") {
      if (zipTimeoutRef.current) clearTimeout(zipTimeoutRef.current);

      zipTimeoutRef.current = setTimeout(() => {
        handleCalculateDistance(value);
      }, 2000); // ✅ Debounce API calls (2 sec delay)
    }
  };

  // ✅ Calculate the total cost including distance
  const calculateQuote = () => {
    const hourlyRate = 50.0; // Per hour charge
    const mileageRate = 0.7; // Per mile charge
    const setupFee = 50.0; // Fixed setup fee
    const hours = parseFloat(formData.hours) || 0;
    const distance = parseFloat(formData.distance) || 0; // ✅ Uses calculated distance

    return (hourlyRate * hours + mileageRate * distance + setupFee).toFixed(2);
  };

  // ✅ Form submission with automatically calculated distance
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.zip2 || formData.zip2.length < 5) {
      alert("Please enter a valid ZIP code before submitting.");
      return;
    }

    if (!formData.distance || isNaN(formData.distance)) {
      alert("Error: Distance calculation failed. Please try again.");
      return;
    }

    try {
      console.log("🚀 Submitting form with:", formData);

      const estimatedQuote = calculateQuote();

      await axiosInstance.post("/forms/dj", { ...formData, estimatedQuote });

      toast.success("🎵 Booking request sent successfully!");

      // ✅ Show Thank You message after successful submission
      if (typeof onSuccess === "function") {
        onSuccess();
      }

      setTimeout(() => setIsOpen(false), 1500); // ✅ Close modal after 1.5 sec

      // ✅ Clear form AFTER modal closes
      setTimeout(() => {
        setFormData({
          eventType: "default",
          eventDate: "",
          genres: [],
          artists: [],
          venue: "",
          organizer: "",
          email: "",
          phone: "",
          notes: "",
          zip2: "",
          hours: "",
          distance: "",
        });
      }, 2000);
    } catch (error) {
      console.error("❌ Error sending request:", error.response?.data || error.message);
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
          <option value="default" disabled>Select an Event Type</option>
          <option value="Wedding">Wedding</option>
          <option value="Club">Club</option>
          <option value="Private Party">Private Party</option>
          <option value="Corporate Event">Corporate Event</option>
        </select>

        <label>Event Date</label>
        <input type="date" className="form-control" name="eventDate" value={formData.eventDate} onChange={handleChange} required />

        <label>Venue</label>
        <input type="text" className="form-control" name="venue" value={formData.venue} onChange={handleChange} required />

        <label>Organizer</label>
        <input type="text" className="form-control" name="organizer" value={formData.organizer} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />

        <label>Phone</label>
        <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
        
        <label>Your ZIP Code</label>
        <input type="text" className="form-control" name="zip2" value={formData.zip2} onChange={handleChange} required />


        <label>Preferred Music Genres</label>
        <div className="d-flex flex-wrap">
          {genresList.map((genre) => (
            <button
              type="button"
              key={genre}
              className={`btn m-1 ${formData.genres.includes(genre) ? "btn-success" : "btn-outline-danger"}`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  genres: prev.genres.includes(genre) ? prev.genres.filter((g) => g !== genre) : [...prev.genres, genre],
                }))
              }
            >
              {genre}
            </button>
          ))}
        </div>

        <label>Preferred Artists</label>
        <input type="text" className="form-control" value={artistInput} onChange={(e) => setArtistInput(e.target.value)} onKeyPress={(e) => {
          if (e.key === "Enter" && artistInput.trim() !== "") {
            setFormData((prev) => ({
              ...prev,
              artists: [...prev.artists, artistInput.trim()],
            }));
            setArtistInput("");
            e.preventDefault();
          }
        }} placeholder="Type artist name and press Enter" />
        <div className="d-flex flex-wrap mt-2">
          {formData.artists.map((artist, index) => (
            <span key={index} className="badge bg-primary m-1 p-2">
              {artist}{" "}
              <button type="button" className="btn btn-sm btn-danger ms-2" onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  artists: prev.artists.filter((a) => a !== artist),
                }))
              }>
                x
              </button>
            </span>
          ))}
        </div>

        <label>Estimated Performance Hours</label>
        <input type="number" className="form-control" name="hours" value={formData.hours} onChange={handleChange} required />

          {/* DELETE AFTER IMPLEMENTATION */}
        {/* <p className="fw-bold mt-3">💰 Estimated Quote: <span className="text-success">${calculateQuote()}</span></p> */}
          {console.log(errorMessage)}
          {console.log(formData.distance)}
        <button type="submit" className="btn btn-success mt-3">🎶 Submit Booking Request</button>
      </form>
    </div>
  );
};

export default DJServiceForm;
