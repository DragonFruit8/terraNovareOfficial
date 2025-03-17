import { useState } from "react";
// import { Button } from "@mui/material";
import axiosInstance from "../api/axios.config";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const stripePromise = loadStripe("pk_live_51H9yaJCJsM5FOXWHe4MYqZdeoHiRQHmwDkmXuvs1qqprojx7p2kJq4QiDZOjTp7bhWjWi9VroFyPgQuSr9rwLOmT00fjHhiTva");

export default function DonorSponsorForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    contributionType: "default",
    involvement: [],
    impacts: [],
    message: "",
    amount: "",
  });

  const impactList = ["Environmental Impact", "Community Growth", "Tech Innovation", "Education"];

  // ✅ Fix: Correctly handle checkboxes & inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        involvement: checked
          ? [...prev.involvement, value]
          : prev.involvement.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // ✅ Fixed Impact Toggle
  const handleImpactToggle = (impact) => {
    setFormData((prev) => ({
      ...prev,
      impacts: prev.impacts.includes(impact)
        ? prev.impacts.filter((g) => g !== impact)
        : [...prev.impacts, impact],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    let newErrors = {};
  
    // Validate required fields
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (formData.contributionType === "default") {
      newErrors.contributionType = "Please select a valid option.";
    }
    if (formData.contributionType === "donation" && !formData.amount) {
      newErrors.amount = "Please enter a donation amount.";
    }
  
    // If errors exist, stop form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      setLoading(true);
  
      // If donation, handle Stripe checkout
      if (formData.contributionType === "donation") {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe failed to initialize");
  
        toast.success("Thank you for your support! Redirecting to checkout...");
  
        const response = await axiosInstance.post("/create-checkout-session", {
          amount: Number(formData.amount),
          email: formData.email,
        });
  
        if (response.data.id) {
          onSuccess();
          return stripe.redirectToCheckout({ sessionId: response.data.id });
        }
      }
  
      // For all other contributions, submit to donor-sponsor route
      const response = await axiosInstance.post("/forms/donor-sponsor", formData);
  
      if (response.status === 200) {
        onSuccess();
        toast.success("🚀 Form submitted successfully!");
      } else {
        throw new Error("Failed to submit form.");
      }
    } catch (error) {
      console.error("Error processing form:", error.message);
      alert("Failed to process form.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <>
      <div className="container mt-3">
        <form onSubmit={handleSubmit} className="row text-start gap-2 fw-bold">
          <h2 aria-hidden="false" className="mb-3 text-center">Get Involved</h2>

          {/* Name */}
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}

          {/* Email */}
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}

          {/* Organization */}
          <label>Organization</label>
          <input
            type="text"
            name="organization"
            placeholder="Organization (if applicable)"
            value={formData.organization}
            onChange={handleChange}
            className="form-control"
          />

          {/* Contribution Type */}
          <label>How would you like to contribute?</label>
          <select
            name="contributionType"
            value={formData.contributionType}
            onChange={handleChange}
            className={`form-control ${errors.contributionType ? "is-invalid" : ""}`}
          >
            <option value="default" disabled>Select Option</option>
            <option value="donation">Make a Donation</option>
            <option value="sponsorship">Become a Sponsor</option>
            <option value="volunteering">Volunteer</option>
            <option value="networking">Business Partnership</option>
            <option value="web_developer">Web Developer</option>
          </select>
          {errors.contributionType && <div className="invalid-feedback">{errors.contributionType}</div>}

          {/* Interests (Checkboxes) */}
          <label>What areas interest you?</label>
          <div className="row">
            {impactList.map((impact) => (
              <button
                type="button"
                key={impact}
                className={`btn m-1 ${formData.impacts.includes(impact) ? "btn-success" : "btn-outline-danger"}`}
                onClick={() => handleImpactToggle(impact)}
              >
                {impact}
              </button>
            ))}
          </div>

          {/* Donation Amount (Only if "Donation" is Selected) */}
          {formData.contributionType === "donation" && (
            <>
              <label>Donation Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="Donation Amount ($)"
                value={formData.amount}
                onChange={handleChange}
                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
              />
              {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
            </>
          )}

          {/* Message */}
          <label>Message</label>
          <textarea
            name="message"
            placeholder="Tell us why you're interested or any message..."
            value={formData.message}
            onChange={handleChange}
            className="form-control"
          ></textarea>

          {/* Submit Button */}
          <button type="submit" className="btn btn-success mt-3">
            {loading ? <><Spinner /> Submitting Form...</> : "Submit Form"}
          </button>
        </form>
      </div>
    </>
  );
}
