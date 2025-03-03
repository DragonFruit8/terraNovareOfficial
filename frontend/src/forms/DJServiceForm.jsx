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
    hours: "",
    distance: "",
  });

  const [quote, setQuote] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateQuote = () => {
    const hourlyRate = 50.0;
    const mileageRate = 0.7;
    const setupFee = 50.0;

    const hours = parseFloat(formData.hours) || 0;
    const distance = parseFloat(formData.distance) || 0;

    const totalCost = (hourlyRate * hours) + (mileageRate * distance) + setupFee;
    setQuote(totalCost.toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const stripe = await stripePromise;
      // console.log("Submitting form data:", formData);
  
      if (formData.contributionType === "donation" && formData.amount) {
        // ✅ First, send form data to your backend
        await axiosInstance.post("/forms/dj", formData);
        alert("Booking request sent successfully!");
  
        // ✅ Then, create a Stripe checkout session
        const response = await axiosInstance.post("/create-checkout-session", {
          amount: formData.amount,
          email: formData.email,
        });
  
        // ✅ Axios parses JSON automatically, so use `response.data`
        const session = response.data;
  
        if (session.id) {
          await stripe.redirectToCheckout({ sessionId: session.id });
        }
      } else {
        // console.log("Form Submitted (Non-Donation):", formData);
      }
    } catch (error) {
      console.error("Error processing donation:", error.response?.data || error.message);
      alert("Failed to process donation.");
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

        {/* Quote Display */}
        {quote !== null && (
          <div className="alert alert-info mt-3">
            <strong>Estimated Cost: ${quote}</strong>
          </div>
        )}

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

        {/* Submit Button */}
        <button type="submit" className="btn btn-success mt-3">Submit Booking Request</button>
      </form>

      {/* Calculate Quote Button */}
      <button onClick={calculateQuote} className="btn btn-primary mt-3">Calculate Quote</button>
    </div>
  );
};

export default DJServiceForm;