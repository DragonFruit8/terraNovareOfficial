import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav id="heroNav" className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">E-Commerce</Link>
        <div>
          <Link className="btn btn-primary mx-2" to="cart">Cart</Link>
          {localStorage.getItem("token") ? (
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link className="btn btn-secondary mx-2" to="login">Login</Link>
              <Link className="btn btn-success" to="register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
