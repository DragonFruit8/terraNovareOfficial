import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "react-feather";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  const { userData, logout } = useUser();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  useEffect(() => {
    setIsDropdownOpen(false); // Reset dropdown when userData updates
  }, [userData]);

  // console.log("🔍 User Data in Nav:", userData);
  // console.log("🔍 User Roles in Nav:", userData?.roles);

  return (
    <nav className="navbar navbar-expand-md bg-body-tertiary px-5">
      <div className="container-fluid">
        <Link className="navbar-brand fs-1" to="/">
          Terra'Novare
        </Link>

        {/* Navigation Links */}
        <ul className="nav d-md-flex navbar-collapse justify-content-end">
          <li className="nav-item">
            <Link className="nav-link" to="/mission">
              Mission
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/brand">
              Brand
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/next">
              What's Next
            </Link>
          </li>
        </ul>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto d-flex flex-row">
            {userData ? (
              <>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/shop">
                    Shop
                  </Link>
                </li>

                {/* User Profile Dropdown */}
                <li ref={dropdownRef} className="nav-item dropdown">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="btn btn-secondary dropdown-toggle"
                  >
                    <User /> {userData?.username || "Account"}
                  </button>

                  {isDropdownOpen && (
                    <div className="dropdown-menu dropdown-menu-end show">
                      {userData?.roles?.includes("admin") ? (
                        <>
                          <Link
                            className="dropdown-item"
                            to="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                        </>
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
                          </>)}
                      <button className="dropdown-item" onClick={handleLogout}>
                        <LogOut /> Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <Link className="btn btn-primary" to="/login">
                Login
              </Link>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
