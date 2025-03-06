import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const WebDevForm = ({ setIsOpen, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  
  // ✅ Ensuring `addOns` and `features` are always arrays to avoid `.includes()` errors
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    packageType: "",
    addOns: [],  // ✅ Always initialize as an array
    maintenancePlan: "",
    budget: "",
    deadline: "",
    notes: "",
  });

  // 📦 Package-Based Pricing
  const packagesPricing = useMemo(() => ({
    "Starter Package": 1000,
    "Business Package": 2500,
    "E-Commerce Package": 3500,
    "Custom MVP": 4500,
  }), []);

  // 🔧 Add-Ons Pricing
  const addOnsPricing = useMemo(() => ({
    "Additional Page": 150,
    "Advanced SEO Optimization": 300,
    "Custom Animations / Effects": 500,
    "Membership / Login System": 1000,
    "API Integration": 750,
    "Live Chat Integration": 300,
    "Booking System": 1000,
    "E-Commerce Expansion": 800,
    "Ongoing Maintenance (Basic)": 50,
    "Ongoing Maintenance (Premium)": 150,
  }), []);

  // 🛠 Maintenance Plan Pricing
  const maintenancePricing = useMemo(() => ({
    "Basic": 50,
    "Standard": 150,
    "Pro": 300,
  }), []);

  // 🔥 Dynamic Price Calculation
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

  // 📌 Handles Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // 🔄 Toggle Features and Add-Ons
  const handleFeatureToggle = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  };

  // 🚀 Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.packageType.trim()) newErrors.packageType = "Please select a package.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // console.log("🧮 Estimated Price Breakdown:");
    // console.log("Package:", formData.packageType, "-", packagesPricing[formData.packageType] || 0);
    // console.log("Add-Ons:", formData.addOns.map(addOn => `${addOn}: $${addOnsPricing[addOn] || 0}`).join(", "));
    // console.log("Maintenance Plan:", formData.maintenancePlan || "None", "-", maintenancePricing[formData.maintenancePlan] || 0);
    // console.log("📊 Total Estimated Cost:", estimatedPrice.toLocaleString());

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

  // 🔥 UI Form
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

        <label>Website Package</label>
        <select className={`form-control ${errors.packageType ? "is-invalid" : ""}`} name="packageType" value={formData.packageType} onChange={handleChange} required>
          <option value="">Select a Package</option>
          {Object.keys(packagesPricing).map((pkg) => (
            <option key={pkg} value={pkg}>{pkg} - ${packagesPricing[pkg].toLocaleString()}</option>
          ))}
        </select>
        {errors.packageType && <div className="invalid-feedback">{errors.packageType}</div>}

        <label>Add-On Features</label>
        <div className="d-flex flex-wrap">
          {Object.keys(addOnsPricing).map((addOn) => (
            <button type="button" key={addOn} className={`btn m-1 ${formData.addOns.includes(addOn) ? "btn-success" : "btn-outline-danger"}`} onClick={() => handleFeatureToggle("addOns", addOn)}>
              {addOn} (+${addOnsPricing[addOn].toLocaleString()})
            </button>
          ))}
        </div>

        <h4 className="mt-3 text-primary">Estimated Price: ${estimatedPrice.toLocaleString()}</h4>
        <button type="submit" className="btn btn-success mt-3" disabled={loading}>{loading ? "Submitting..." : "Submit Inquiry"}</button>
      </form>
    </div>
  );
};

export default WebDevForm;