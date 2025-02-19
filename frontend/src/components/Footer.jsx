import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container text-center">
        <div className="row">
          {/* Left Section - Navigation */}
          <div className="col-md-4">
            <h5>Navigation</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light">Home</Link></li>
              <li><Link to="/shop" className="text-light">Shop</Link></li>
              <li><Link to="/mission" className="text-light">Mission</Link></li>
              <li><Link to="/brand" className="text-light">Brand</Link></li>
              <li><Link to="/next" className="text-light">What's Next</Link></li>
            </ul>
          </div>

          {/* Middle Section - Social Media */}
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <i className="fab fa-facebook fa-2x"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <i className="fab fa-twitter fa-2x"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <i className="fab fa-instagram fa-2x"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <i className="fab fa-linkedin fa-2x"></i>
              </a>
            </div>
          </div>

          {/* Right Section - Contact */}
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p>Email: support@terranovare.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} Terra'Novare. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
