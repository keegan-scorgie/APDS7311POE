import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("jwt");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.alert("Successfully logged out");
    navigate("/login");
  };

  return (
    <nav>
      <ul className="navbar">
        <li>
          <Link to={isLoggedIn ? "/customerHome" : "/"}>Home</Link>
        </li>
   
        {!isLoggedIn && (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}

        {isLoggedIn && (
          <>
            <li><Link to="/paymentPage">Make a Payment</Link></li>
            <li><Link to="/paymentHistory">Payment History</Link></li>
            <li className="logout-btn">
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;