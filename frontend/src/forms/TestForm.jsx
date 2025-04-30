import { useState } from "react";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";


function TestForm() {
  const [loading ] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    monetary: [],
    medical: [],
    urgentRequest: [],
    requestType: "default",
    customRequest: "",
    amount: "",
    medRequestType: "default",
    medicalReason: "",
    awardMessage: "",
    
  });

  const needsList = ["Yes", "No"];
  const medicalChoice = ["Yes", "No"];
  const urgentRequest = ["Yes", "No"];

  // ✅ Fix: Correctly handle checkboxes & inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked ? [...prev[name], value] : prev[name].filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // ✅ Fixed money Toggle
  const handlemoneyToggle = (money) => {
    setFormData((prev) => ({
      ...prev,
      monetary: prev.monetary.includes(money) ? [] : [money],
    }));   
  };
  const handleMedicalToggle = (med) => {
    setFormData((prev) => ({
      ...prev,
      medical: prev.medical.includes(med) ? [] : [med],
    }));
  };

  const handleUrgentToggle = (urgentRequest) => {
    setFormData((prev) => ({
      ...prev,
      urgentRequest: prev.urgentRequest.includes(urgentRequest) ? [] : [urgentRequest],
    }));
    setErrors((prevErrors) => ({ ...prevErrors, urgentRequest: "" }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    let newErrors = {};
  
    // Validate required fields
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    // if (formData.requestType === "default") {
    //   newErrors.requestType = "Please select a valid option.";
    // }

    // if (formData.medRequestType === "default") {
    //   newErrors.medRequestType = "Please select a valid option.";
    // }
    // if (formData.monetary.includes("Yes") && !formData.amount.trim()) {
    //   newErrors.amount = "Amount is required.";
    // } 

    
    // Check if there are any errors
    // if (Object.keys(newErrors).length > 0) {
    //   setErrors(newErrors);
    //   return;
    // }
    // Submit the form data
    try {
      await axiosInstance.post("/solidarity-fund-request", formData);
      console.log(formData);
      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }
      // if (response.ok) {
      //   toast.success("Solidarity Form Submitted!");
      // }
        toast.success("Solidarity Form Submitted!");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    // Reset form data
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      monetary: [],
      medical: [],
      urgentRequest: [],
      requestType: "default",
      customRequest: "",
      amount: "",
      medRequestType: "default",
      medicalReason: "",
      awardMessage: "",
    });
    // Reset errors
    setErrors({});
  };
  

  return (
    <>
    <div className="d-flex row justify-content-center align-items-center vh-auto p-5">
    <div className="container mt-3">
        <form onSubmit={handleSubmit} className="row text-start gap-2 fw-bold">
          <h2 aria-hidden="false" className="mb-3 text-center">Solidarity Fund Request</h2>

          {/* Name */}
          <label>Full Name</label>
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

          {/* Phone Number */}
          <label>Phone #</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter #: 7348887777"
            value={formData.phone}
            onChange={handleChange}
            className="form-control"
            required
          />
           {/* Message */}
           <label>Describe Issue/Reason</label>
          <textarea
            name="message"
            placeholder="Tell us how the funds would help you."
            value={formData.message}
            onChange={handleChange}
            className="form-control"
          ></textarea>

          {/* Monetary Request (Checkboxes) */}
          <label>Monetary Request?</label>
          <div className="row">
            {needsList.map((money) => (
              <button
                type="button"
                key={money}
                className={`btn m-1 ${formData.monetary.includes(money) ? "btn-success" : "btn-outline-danger"}`}
                onClick={() => handlemoneyToggle(money)}
              >
                {money}
              </button>
            ))}
          </div>
           <div className="row">
           {formData.monetary.includes("Yes") && (
            <>
            <div className="row">
             <label> Enter Amount ($) Needed </label>
          <input 
            type="text"
            name="amount"
            placeholder="$ USD"
            onChange={handleChange}
            className={`form-control ${errors.amount ? "is-invalid" : ""}`}
            />
            </div>
            </>
          )}    
           </div>
          
           {/* Medical or non-medical */}
          <label>Is the request medical related?</label>
          <div className="row">
            {medicalChoice.map((med) => (
              <button
                type="button"
                key={med}
                className={`btn m-1 ${formData.medical.includes(med) ? "btn-success" : "btn-outline-danger"}`}
                onClick={() => handleMedicalToggle(med)}
              >
                {med}
              </button>
            ))}
            </div>   
            {
              formData.monetary.includes("Yes") && formData.medical.includes("No") && (
                <>
                <label>What are you requesting?</label>
                <select
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleChange}
                  className={`form-control ${errors.requestType ? "is-invalid" : ""}`}
                >
                  <option value="default" disabled>Select Option</option>
                  <option value="repair">Car Repair</option>
                  <option value="meals">Homemade Meals</option>
                  <option value="carpool">Need a Ride</option>
                  <option value="maintenance Consultation">Repair Consultation</option>
                  <option value="other">Other</option>
                </select>
                </>
              )}
          {errors.requestType && <div className="invalid-feedback">{errors.requestType}</div>}
          {/* Medical related request list */}
          {formData.monetary.includes("Yes") && formData.medical.includes("Yes") && (
            <>
            <label>Is this Urgent?</label>
            <div className="row"> 
            {urgentRequest.map((urgentReq) => (
              <button
                type="button"
                key={urgentReq}
                value={urgentReq}
                className={`btn m-1 ${formData.urgentRequest.includes(urgentReq) ? "btn-success" : "btn-outline-danger"}`}
                onClick={() => handleUrgentToggle(urgentReq)}
              >
                {urgentReq}
              </button>
          ))}
            </div>
                </>
          )}
               
          {formData.monetary.includes("No") && formData.medical.includes("No") && (
          <>
          <label>What are you requesting?</label>
          <select
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            className={`form-control ${errors.requestType ? "is-invalid" : ""}`}
          >
            <option value="default" disabled>Select Option</option>
            <option value="repair">Car Repair</option>
            <option value="meals">Homemade Meals</option>
            <option value="carpool">Need a Ride</option>
            <option value="maintenance Consultation">Repair Consultation</option>
            <option value="other">Other</option>
          </select>
          </>
          )}
          {errors.requestType && <div className="invalid-feedback">{errors.requestType}</div>}
          {/* Medical yes or no */}
          
          

          {/* Donation Amount (Only if "Donation" is Selected) */}
          {formData.requestType === "other" && (
            <>
              <label>Custom Request</label>
              <input
                type="text"
                name="customRequest"
                placeholder="What is the request?"
                value={formData.customRequest}
                onChange={handleChange}
                className={`form-control ${errors.customRequest ? "is-invalid" : ""}`}
              />
              {errors.customRequest && <div className="invalid-feedback">{errors.customRequest}</div>}
            </>
          )}
          {formData.medical.includes("Yes") && (
            // Medical related request list
            <>
            <label>What are you requesting?</label>
            <select 
            name="medRequestType"
            value={formData.medRequestType}
            onChange={handleChange}
            className={`form-control ${errors.medRequestType ? "is-invalid" : ""}`}
            >
            <option value="default" disabled>Select Option</option>
            <option value="consultation"> Consultation</option>
            <option value="medication"> Medication</option>
            <option value="surgery" > Surgery</option>
            <option value="other">Other</option>
            <option value="PND">Prefer Not To Disclose</option>

            </select>
            {errors.medRequestType && <div className="invalid-feedback">{errors.medRequestType} </div>}
            </>
          )}

          {formData.medRequestType === "other" && (
            <>
            <label for="medicalReason">Medical Request</label>
            <input
            type="text"
            name="medicalReason"
            placeholder="What is the request?"
            value={formData.medicalReason}
            onChange={handleChange}
            className={`form-control ${errors.medicalReason ? "is-invalid" : ""}`}
            />
            {errors.medicalReason && <div className="invalid-feedback">{errors.medicalReason}</div>}
            </>
            )}

            {/* Show when all checkboxes are checked */}
            {/* { formData.monetary.type => checked, formData.medical.type => checked, formData.urgentRequest.type => checked */}
            {formData.monetary.type === true && formData.medical.type === true && formData.urgentRequest.type === true && (
              <>
              <label for="awardMessage">How would this help you?</label>
              <input
                type="text"
                name="awardMessage"
                placeholder="What is the request?"
                value={formData.medicalHelp}
                onChange={handleChange}
                className={`form-control ${errors.medicalHelp ? "is-invalid" : ""}`}
              />
              {errors.medicalHelp && <div className="invalid-feedback">{errors.medicalHelp}</div>}
              </>
            )} 

          {/* Submit Button */}
          <button type="submit" className="btn btn-success mt-3">
            {loading ? <>Submitting Form...</> : "Submit Form"}
          </button>
        </form>
      </div>
      </div>
    </>
  );
}

export default TestForm;