import React, { useState } from "react";
import axiosInstance from "../api/axios.config";

const WebDevForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    website: "",
    websiteType: "",
    features: [],
    techStack: "",
    budget: "",
    deadline: "",
    notes: "",
  });

  const [currentFeature, setCurrentFeature] = useState("");

  const websiteTypes = ["E-commerce", "Portfolio", "Blog", "Business", "Landing Page"];
  const featuresList = ["Online Store", "Booking System", "Contact Form", "CMS", "SEO Optimization"];
  const techStacks = ["React", "WordPress", "Shopify", "Custom Code"];
  const budgetOptions = ["<$1,000", "$1,000-$5,000", "$5,000-$10,000", "$10,000+"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/forms/webdev", formData);
      alert("Inquiry submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        industry: "",
        website: "",
        websiteType: "",
        features: [],
        techStack: "",
        budget: "",
        deadline: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error sending inquiry", error);
      alert("Failed to send inquiry.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Website Development Inquiry</h2>
      <form onSubmit={handleSubmit}>
        
        <label>Name</label>
        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />

        <label>Phone</label>
        <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />

        <label>Company Name</label>
        <input type="text" className="form-control" name="company" value={formData.company} onChange={handleChange} />

        <label>Industry</label>
        <input type="text" className="form-control" name="industry" value={formData.industry} onChange={handleChange} />

        <label>Existing Website (if applicable)</label>
        <input type="url" className="form-control" name="website" value={formData.website} onChange={handleChange} />

        <label>Website Type</label>
        <select className="form-control" name="websiteType" value={formData.websiteType} onChange={handleChange}>
          <option value="">Select a Website Type</option>
          {websiteTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <label>Features Needed</label>
        <div className="d-flex flex-wrap">
          {featuresList.map((feature) => (
            <button
              type="button"
              key={feature}
              className={`btn m-1 ${formData.features.includes(feature) ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => handleFeatureToggle(feature)}
            >
              {feature}
            </button>
          ))}
        </div>

        <label>Preferred Technology Stack</label>
        <select className="form-control" name="techStack" value={formData.techStack} onChange={handleChange}>
          <option value="">Select a Tech Stack</option>
          {techStacks.map((stack) => (
            <option key={stack} value={stack}>{stack}</option>
          ))}
        </select>

        <label>Budget Range</label>
        <select className="form-control" name="budget" value={formData.budget} onChange={handleChange}>
          <option value="">Select Budget</option>
          {budgetOptions.map((budget) => (
            <option key={budget} value={budget}>{budget}</option>
          ))}
        </select>

        <label>Project Deadline</label>
        <input type="date" className="form-control" name="deadline" value={formData.deadline} onChange={handleChange} />

        <label>Additional Notes</label>
        <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange}></textarea>

        <button type="submit" className="btn btn-success mt-3">Submit Inquiry</button>
      </form>
    </div>
  );
};

export default WebDevForm;
