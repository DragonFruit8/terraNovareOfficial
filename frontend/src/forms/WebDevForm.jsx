import React, { useState } from "react";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const WebDevForm = ({ setIsOpen, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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

  const websiteTypes = ["E-commerce", "Portfolio", "Blog", "Business", "Landing Page"];
  const featuresList = ["Online Store", "Booking System", "Contact Form", "CMS", "SEO Optimization"];
  const techStacks = ["WordPress", "Shopify", "Custom Code"];
  const budgetOptions = ["<$1,000", "$1,000-$5,000", "$5,000-$10,000", "$10,000+"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        features: checked
          ? [...prev.features, value]
          : prev.features.filter((f) => f !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
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
    let newErrors = {};
  
    // ✅ Improved Validation with User Feedback
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.websiteType.trim()) newErrors.websiteType = "Please select a website type.";
    if (!formData.techStack.trim()) newErrors.techStack = "Please select a technology stack.";
    if (!formData.budget.trim()) newErrors.budget = "Please select a budget range.";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      setLoading(true);
      setErrors({}); // ✅ Reset errors on new submission attempt
  
      console.log("🚀 Submitting form data:", formData);
      const response = await axiosInstance.post("/forms/webdev", formData);
  
      if (!response || response.status !== 200) {
        throw new Error("Invalid response from server.");
      }
  
      console.log("✅ Server response:", response.data);
  
      // ✅ Show Thank You Message
      if (typeof onSuccess === "function") {
        onSuccess();
      }
      toast.success("🚀 Inquiry submitted successfully!");
      // ✅ Close modal after 1.5 sec
      setTimeout(() => setIsOpen(false), 1500);
  
      // ✅ Clear form AFTER modal closes
      setTimeout(() => {
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
      }, 2000);
    } catch (error) {
      console.error("❌ Submission failed:", error.response?.data || error.message);
      
      // ✅ Provide User Feedback on Failure
      setErrors({ form: "Failed to send inquiry. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mt-3">
      <h2 className="mb-4">Website Development Inquiry</h2>
      <form onSubmit={handleSubmit} className="row text-start gap-2 fw-bold">
        <label>Name</label>
        <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} name="name" value={formData.name} onChange={handleChange} required />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}

        <label>Email</label>
        <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} name="email" value={formData.email} onChange={handleChange} required />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}

        <label>Phone</label>
        <input type="tel" className={`form-control ${errors.phone ? "is-invalid" : ""}`} name="phone" value={formData.phone} onChange={handleChange} required />
        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        
        <label>Company</label>
        <input type="text" className={`form-control ${errors.company ? "is-invalid" : ""}`} name="company" value={formData.company} onChange={handleChange} required />
        {errors.company && <div className="invalid-feedback">{errors.company}</div>}
        <label>Industry</label>
        <input type="text" className={`form-control ${errors.industry ? "is-invalid" : ""}`} name="industry" value={formData.industry} onChange={handleChange} required />
        {errors.industry && <div className="invalid-feedback">{errors.industry}</div>}
        
        <label>Website</label>
        <input type="text" className={`form-control ${errors.website ? "is-invalid" : ""}`} name="website" value={formData.website} onChange={handleChange} required />
        {errors.website && <div className="invalid-feedback">{errors.website}</div>}

        <label>Website Type</label>
        <select className={`form-control ${errors.websiteType ? "is-invalid" : ""}`} name="websiteType" value={formData.websiteType} onChange={handleChange}>
          <option value="">Select a Website Type</option>
          {websiteTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.websiteType && <div className="invalid-feedback">{errors.websiteType}</div>}

        <label>Features Needed</label>
        <div className="d-flex flex-wrap">
          {featuresList.map((feature) => (
            <button id="featureBtn" type="button" key={feature} className={`btn m-1 ${formData.features.includes(feature) ? "btn-success" : "btn-outline-danger"}`} onClick={() => handleFeatureToggle(feature)}>
              {feature}
            </button>
          ))}
        </div>

        <label>Preferred Technology Stack</label>
        <select className={`form-control ${errors.techStack ? "is-invalid" : ""}`} name="techStack" value={formData.techStack} onChange={handleChange}>
          <option value="">Select a Tech Stack</option>
          {techStacks.map((stack) => (
            <option key={stack} value={stack}>{stack}</option>
          ))}
        </select>
        {errors.techStack && <div className="invalid-feedback">{errors.techStack}</div>}

        <label>Budget Range</label>
        <select className={`form-control ${errors.budget ? "is-invalid" : ""}`} name="budget" value={formData.budget} onChange={handleChange}>
          <option value="">Select Budget</option>
          {budgetOptions.map((budget) => (
            <option key={budget} value={budget}>{budget}</option>
          ))}
        </select>
        {errors.budget && <div className="invalid-feedback">{errors.budget}</div>}

        <label>Project Deadline</label>
        <input type="date" className="form-control" name="deadline" value={formData.deadline} onChange={handleChange} />

        <label>Additional Notes</label>
        <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange}></textarea>

        <button type="submit" className="btn btn-success mt-3" disabled={loading}>
          {loading ? "Submitting..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
};

export default WebDevForm;