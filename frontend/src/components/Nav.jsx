import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "react-feather";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Collapse from "bootstrap/js/dist/collapse";
import { FaBars } from "react-icons/fa";

const Nav = () => {
  const { userData, logout } = useUser();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navbarRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Reset dropdown when userData updates
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [userData]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Toggle Bootstrap Navbar Collapse
  const toggleNav = () => {
    if (navbarRef.current) {
      const bsCollapse = new Collapse(navbarRef.current, { toggle: false });
      isNavOpen ? bsCollapse.hide() : bsCollapse.show();
      setIsNavOpen(!isNavOpen);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand fs-1" to="/">
          Terra'Novare
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNav}
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
         <FaBars />
        </button>

        {/* Collapsible Navigation */}
        <div ref={navbarRef} className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/mission" onClick={toggleNav}>
                Mission
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/brand" onClick={toggleNav}>
                Brand
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/next" onClick={toggleNav}>
                What's Next
              </Link>
            </li>
          </ul>
        </div>

        {/* User Menu */}
        <div className="navbar-collapse">
          <ul className="navbar-nav ms-auto d-flex flex-row justify-content-end">
            {userData ? (
              <>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/shop">
                    Shop
                  </Link>
                </li>

                {/* Dropdown - Wrapped in a Relative Container */}
                <li ref={dropdownRef} className="nav-item dropdown position-relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="btn btn-secondary dropdown-toggle"
                  >
                    <User /> {userData?.username || "Account"}
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="dropdown-menu dropdown-menu-end position-absolute mt-1 shadow"
                      style={{
                        display: "block", // Ensures it's visible
                        right: 0, // Aligns to button
                        minWidth: "200px", // Prevents collapse
                        zIndex: 1050, // Keeps it above other elements
                        backgroundColor: "#fff", // Ensures visibility
                      }}
                    >
                      {userData?.roles?.includes("admin") ? (
                        <Link
                          className="dropdown-item"
                          to="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      ) : (
                        <>
                          <Link
                            className="dropdown-item"
                            to="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Profile
                          </Link>
                          <Link
                            className="dropdown-item"
                            to="/orders"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Orders
                          </Link>
                        </>
                      )}
                      <div className="dropdown-item p-2">
                        <button className="btn btn-danger m-0" onClick={handleLogout}>
                          <LogOut /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </li>

              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-primary" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
