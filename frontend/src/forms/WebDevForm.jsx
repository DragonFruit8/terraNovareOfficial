import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const WebDevForm = ({ setIsOpen, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    packageType: "",
    addOns: [],
    maintenancePlan: "",
    budget: "",
    deadline: "",
    notes: "",
    websitePurpose: "",
    preferredDesignStyle: "",
    competitorWebsites: "",
    additionalFeatures: "",
  });
  const budgetOptions = [
    "Under $1,000",
    "$1,000 - $2,500",
    "$2,500 - $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000+",
  ];

  const industryOptions = [
    "Technology", "Healthcare", "Finance", "Education", 
    "Retail", "Real Estate", "Entertainment", "Other"
  ];

  const packagesPricing = useMemo(() => ({
    "Starter Package": 1000,
    "Business Package": 2500,
    "E-Commerce Package": 3500,
    "Custom MVP": 4500,
  }), []);

  const addOnsPricing = useMemo(() => ({
    "Additional Page": 150,
    "Advanced SEO Optimization": 300,
    "Custom Animations / Effects": 500,
    "Membership / Login System": 1000,
    "API Integration": 750,
    "Live Chat Integration": 300,
    "Booking System": 1000,
    "E-Commerce Expansion": 800,
    // "Ongoing Maintenance (Basic)": 50,
    // "Ongoing Maintenance (Premium)": 150,
  }), []);

  const additionalFeaturesOptions = [
    "Blog Integration",
    "Live Chat",
    "Customer Portal",
    "Multilingual Support",
    "Advanced Analytics",
    "Newsletter Signup",
    "Custom Animations",
    "Dark Mode Toggle",
    "Other"
  ];

  const maintenancePricing = useMemo(() => ({
    "Basic": 50,
    "Standard": 150,
    "Pro": 300,
  }), []);

  const websitePurposeOptions = [
    "Business Website",
    "E-Commerce Store",
    "Portfolio",
    "Blog/News",
    "Non-Profit/Charity",
    "Landing Page",
    "Other"
  ];

  const designStyleOptions = [
    "Minimalist",
    "Modern & Sleek",
    "Bold & High-Contrast",
    "Corporate & Professional",
    "Creative & Artsy",
    "Fun & Playful",
    "Dark Mode",
    "Other"
  ];
  
  useEffect(() => {
    let total = packagesPricing[formData.packageType] || 0;

    formData.addOns.forEach((addOn) => {
      total += addOnsPricing[addOn] || 0;
    });

    if (formData.maintenancePlan) {
      total += maintenancePricing[formData.maintenancePlan] || 0;
    }

    setEstimatedPrice(total);
  }, [formData.packageType, formData.addOns, formData.maintenancePlan, packagesPricing, addOnsPricing, maintenancePricing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFeatureToggle = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    ["name", "email", "phone", "company", "industry", "packageType", "budget"].forEach((field) => {
      if (!formData[field].trim()) newErrors[field] = "This field is required.";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await axiosInstance.post("/forms/webdev", {
        ...formData,
        estimatedPrice,
      });

      if (!response || response.status !== 200) {
        throw new Error("Invalid response from server.");
      }

      toast.success("🚀 Inquiry submitted successfully!");
      if (typeof onSuccess === "function") onSuccess();

      setTimeout(() => setIsOpen(false), 1500);
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          industry: "",
          packageType: "",
          addOns: [],
          maintenancePlan: "",
          budget: "",
          deadline: "",
          notes: "",
          websitePurpose: "",
          preferredDesignStyle: "",
          competitorWebsites: "",
          additionalFeatures: "",
          estimatedPrice: 0,
        });
      }, 2000);
    } catch (error) {
      console.error("❌ Submission failed:", error.response?.data || error.message);
      setErrors({ form: "Failed to send inquiry. Please try again." });
      toast.error("❌ Failed to send estimate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-4">Website Development Inquiry</h2>
      <form onSubmit={handleSubmit} className="row text-start gap-2 fw-bold">
        
        <label>Name</label>
        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
        {errors.name && <small className="text-danger">{errors.name}</small>}

        <label>Email</label>
        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        {errors.email && <small className="text-danger">{errors.email}</small>}

        <label>Phone</label>
        <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
        {errors.phone && <small className="text-danger">{errors.phone}</small>}

        <label>Company</label>
        <input type="text" name="company" className="form-control" value={formData.company} onChange={handleChange} required />
        {errors.company && <small className="text-danger">{errors.company}</small>}

        <label>Industry</label>
          <select name="industry" value={formData.industry} className="form-control" onChange={handleChange} required>
            <option value="">Select Industry</option>
            {industryOptions.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          {errors.industry && <small className="text-danger">{errors.industry}</small>}

          <label>Website Purpose</label>
            <select name="websitePurpose" value={formData.websitePurpose} className="form-control" onChange={handleChange}>
              <option value="">Select Website Purpose</option>
              {websitePurposeOptions.map((purpose) => (
                <option key={purpose} value={purpose}>{purpose}</option>
              ))}
            </select>
            
            <label>Preferred Design Style</label>
              <select name="preferredDesignStyle" value={formData.preferredDesignStyle} className="form-control" onChange={handleChange}>
                <option value="">Select a Design Style</option>
                {designStyleOptions.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              
              {formData.preferredDesignStyle === "Other" && (
                <input type="text" name="customDesignStyle" className="form-control" value={formData.customDesignStyle} onChange={handleChange} placeholder="Describe your preferred style..." />
              )}

        <label>Website Package</label>
          <select name="packageType" value={formData.packageType} className="form-control" onChange={handleChange} required>
            <option value="">Select a Package</option>
            {Object.keys(packagesPricing).map((pkg) => (
              <option key={pkg} value={pkg}>{pkg} - ${packagesPricing[pkg].toLocaleString()}</option>
            ))}
          </select>
          {errors.packageType && <small className="text-danger">{errors.packageType}</small>}

        <label>Budget</label>
          <select name="budget" value={formData.budget} className="form-control" onChange={handleChange} required>
            <option value="">Select Budget Range</option>
              {budgetOptions.map((range) => (
            <option key={range} value={range}>{range}</option>
              ))}
          </select>
            {errors.budget && <small className="text-danger">{errors.budget}</small>}

        <label>Add-On Features (Optional)</label>
        <div className="d-flex flex-wrap">
          {Object.keys(addOnsPricing).map((addOn) => (
            <button type="button" key={addOn} className={`btn m-1 ${formData.addOns.includes(addOn) ? "btn-success" : "btn-outline-danger"}`} onClick={() => handleFeatureToggle("addOns", addOn)}>
              {addOn} (+${addOnsPricing[addOn].toLocaleString()})
            </button>
          ))}
        </div>

        <label>Additional Features (Optional)</label>
            <div className="d-flex flex-wrap">
              {additionalFeaturesOptions.map((feature) => (
                <button
                  type="button"
                  key={feature}
                  className={`btn m-1 ${formData.additionalFeatures.includes(feature) ? "btn-success" : "btn-outline-primary"}`}
                  onClick={() => handleFeatureToggle("additionalFeatures", feature)}
                >
                  {feature}
                </button>
              ))}
            </div>
            
            {formData.additionalFeatures.includes("Other") && (
              <input
                type="text"
                name="customAdditionalFeatures"
                value={formData.customAdditionalFeatures}
                onChange={handleChange}
                placeholder="Describe any other features you need..."
              />
            )}
        <label>Maintenance Plan (Optional)</label>
          <select name="maintenancePlan" value={formData.maintenancePlan} className="form-control" onChange={handleChange}>
            <option value="">Select a Maintenance Plan</option>
            {Object.keys(maintenancePricing).map((plan) => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>

        <label>Project Deadline</label>
          <input type="date" name="deadline" value={formData.deadline} className="form-control" onChange={handleChange} required />
          {errors.deadline && <small className="text-danger">{errors.deadline}</small>}

          <label>Competitor Websites (Optional)</label>
          <textarea name="competitorWebsites" value={formData.competitorWebsites} className="form-control" onChange={handleChange} placeholder="List competitor websites, separated by commas..." />

          <label>Additional Notes (Optional)</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-control" placeholder="Any extra details you'd like to share..." />
    

        <h4 className="mt-3 text-primary">Estimated Price: ${estimatedPrice.toLocaleString()}</h4>
        <button type="submit" className="btn btn-success mt-3" disabled={loading}>{loading ? "Submitting..." : "Submit Inquiry"}</button>
      </form>
    </div>
  );
};

export default WebDevForm;
