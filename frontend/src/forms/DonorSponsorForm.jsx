import { useState } from "react";
import { Button } from "@mui/material";
import axiosInstance from "../api/axios.config";
import { loadStripe } from "@stripe/stripe-js";
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
    message: "",
    amount: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // ✅ Improved Validation
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (formData.contributionType === "default") newErrors.contributionType = "Please select a valid option.";
    if (formData.contributionType === "donation" && !formData.amount) newErrors.amount = "Please enter a donation amount.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      // console.log("Submitting form data:", formData);

      if (formData.contributionType === "donation" && formData.amount) {
        alert("Thank you for your support! Redirecting to checkout...");

        const response = await axiosInstance.post("/create-checkout-session", {
          amount: Number(formData.amount),
          email: formData.email,
        });

        // console.log("Stripe session response:", response.data);

        if (response.data.id) {
          onSuccess();
          setTimeout(() => stripe.redirectToCheckout({ sessionId: response.data.id }), 3000);
        }
      } else {
        // console.log("Form Submitted (Non-Donation):", formData);
        onSuccess();
        alert("Form submitted successfully!");
      }
    } catch (error) {
      console.error("Error processing donation:", error.message);
      alert("Failed to process donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="row justify-content-center align-items-center text-start gap-2 fw-bold mx-auto">
        <h2 className="mb-4">Get Involved</h2>

        {/* Name */}
        <div className="py-1">
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
        </div>

        {/* Email */}
        <div className="py-1">
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
        </div>

        {/* Organization */}
        <div className="py-1">
          <label>Organization</label>
          <input
            type="text"
            name="organization"
            placeholder="Organization (if applicable)"
            value={formData.organization}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Contribution Type */}
        <div className="py-1">
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
        </div>

        {/* Interests (Checkboxes) */}
        <div className="py-1">
          <label>What areas interest you?</label>
          <div className="form-control row">
            {["Environmental Impact", "Community Growth", "Tech Innovation", "Education"].map((area) => (
              <label key={area}>
                <input type="checkbox" name="involvement" value={area} onChange={handleChange} className="mr-2" />
                {area}
              </label>
            ))}
          </div>
        </div>

        {/* Donation Amount (Only if "Donation" is Selected) */}
        {formData.contributionType === "donation" && (
          <div className="py-1">
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
          </div>
        )}

        {/* Message */}
        <div className="py-1">
          <label>Message</label>
          <textarea
            name="message"
            placeholder="Tell us why you're interested or any message..."
            value={formData.message}
            onChange={handleChange}
            className="form-control"
          ></textarea>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="btn btn-success mt-3">
          {loading ? <><Spinner /> Submitting Form...</> : "Submit Form"}
        </Button>
      </form>
    </>
  );
}
