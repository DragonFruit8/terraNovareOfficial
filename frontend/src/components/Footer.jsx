import React from "react";
import { Link } from "react-router-dom";
import { 
  // FaInstagram, 
  FaLinkedin, 
  FaTiktok } from "react-icons/fa";
import { FaBluesky } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container text-center my-3">
        <div className="row">
          {/* Left Section - Navigation */}
          <div className="col-md-4">
            <h5>Navigation</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/shop" className="nav-link">Shop</Link></li>
              <li><Link to="/mission" className="nav-link">Mission</Link></li>
              <li><Link to="/brand" className="nav-link">Brand</Link></li>
              <li><Link to="/next" className="nav-link">What's Next</Link></li>
            </ul>
          </div>

          {/* Middle Section - Social Media */}
          <div className="col-md-4 pb-2">
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center gap-3">
              <Link className="nav-link" to="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
                <FaTiktok />
              </Link>
              <Link className="nav-link" to="https://bsky.app/profile/terranovare.bsky.social" target="_blank" rel="noopener noreferrer">
                <FaBluesky  />
              </Link>
              {/* <Link className="nav-link" to="/" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </Link> */}
              <Link className="nav-link" to="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </Link>
            </div>
          </div>

          {/* Right Section - Contact */}
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p>Email: <br /><a className="nav-link" href="mailto:jtb.phoenixone@gmail.com">jtb.phoenixone@gmail.com</a></p>
            <p>Phone: <br /><a className="nav-link" href="tel:3138892915"> (313) 889-2915</a></p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-1">
         <p className="mb-0">&copy; {new Date().getFullYear()} Terra'Novare. All Rights Reserved.</p> 
         <Link to="/terms">Terms & Conditions</Link> | <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
