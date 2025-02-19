import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import "../Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null); // Reference to sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar px-3">
        <div className="navbar-title" onClick={toggleSidebar}>
          {isOpen ? <FaTimes /> : <FaBars />} Menu
        </div>
        <Link to="/" className="home-btn"><FaHome /> Home</Link>
      </nav>

      {/* Sidebar Drawer */}
      <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
        <div >
          <button id="sidebarClose" className="btn btn-close btn-close-white" onClick={()=> setIsOpen(false)}></button>
        </div>
        <ul>
          <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/mission" onClick={() => setIsOpen(false)}>Missions</Link></li>
          <li><Link to="/brand" onClick={() => setIsOpen(false)}>Brand</Link></li>
          <li><Link to="/next" onClick={() => setIsOpen(false)}>What's Next</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
