import React, { useState } from "react";
import DonorSponsorForm from "../forms/DonorSponsorForm";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const EfinityLanding = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSuccess = () => {
    setShowThankYou(true); // ✅ Show Thank You message
    setTimeout(() => {
      handleClose(); // ✅ Close modal after 5 seconds
      setShowThankYou(false); // Reset for next time
    }, 5000);
  };

  return (
    <>
      <div>
        {/* Header Section */}
        <section className="row bg-dark text-white text-center py-5 titleHeader">
          <h1 aria-hidden="false" className="featurette-heading">
            Welcome to E-Finity
          </h1>
          <p aria-hidden="false" className="lead">
            Empowering communities through sustainable and interconnected
            solutions.
          </p>
        </section>
        <div className="container">
          {/* Tree Model Section */}
          <section className="row featurette align-items-center py-4">
            <h2 aria-hidden="false" className="featurette-heading">
              Mission
            </h2>
            <p aria-hidden="false" className="lead">
              To promote effective operational functionality in startups, drive
              philanthropic efforts, and facilitate community education in
              propositions based on consensus through local leadership.
            </p>
            {/* <div className="flex justify-center mt-4">
          <img src="/tree-model.png" alt="Tree Model" className="w-64 h-auto" />
        </div> */}
          </section>
          <hr className="featurette-divider" />
          <section className="row featurette align-items-center py-4">
            <h2 aria-hidden="false" className="featurette-heading">
              Why do we EXIST?
            </h2>
            <p aria-hidden="false" className="lead">
              E-Finity aims to steward the growth of startups, increase
              community awareness on key issues, facilitate community led
              initiatives that prioritize environmental awareness, respect and
              nurturing of human life, while acting as an implementation and
              guide effectiveness in organization during the startup process.
            </p>
            {/* <div className="flex justify-center mt-4">
          <img src="/tree-model.png" alt="Tree Model" className="w-64 h-auto" />
          </div> */}
          </section>
          <hr className="featurette-divider" />
          <section className="row featurette align-items-center py-4">
            <h2 aria-hidden="false" className="featurette-heading">
              What is our purpose?
            </h2>
            <p aria-hidden="false" className="lead">
              E-Finity aims to establish a regular business model while
              operating on a local level in each state and/or county within the
              US market. The implementation of policies, regulations, and
              practices are at the forefront of E-Finity's mission to unify
              business practices with environmental considerations, human
              resources, and material management.
            </p>
            {/* <div className="flex justify-center mt-4">
          <img src="/tree-model.png" alt="Tree Model" className="w-64 h-auto" />
        </div> */}
          </section>
          <hr className="featurette-divider" />
          {/* Call to Action */}
          <section className="featurette align-items-center py-4">
            <h2 className="text-2xl font-bold text-red-500">
              Join the Movement
            </h2>
            <p aria-hidden="false" className="lead">
              Help us make a difference! Whether you volunteer, donate, or
              spread awareness, your contribution matters.
            </p>
            <button className="btn btn-primary" onClick={handleShow}>
              Get Involved
            </button>
          </section>
          {/* <hr className="featurette-divider" /> */}
        </div>
      </div>
      {showThankYou ? (
        // ✅ "Thank You" Screen
        <div className="text-center">
          <h2 aria-hidden="false" className="modal-title">
            🎉 Thank You! 🎉
          </h2>
          <p aria-hidden="false" className="lead">
            Your support means the world to us!
          </p>
        </div>
      ) : (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Get Involved</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DonorSponsorForm onSuccess={handleSuccess} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default EfinityLanding;
