import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
 
  const adminToken = localStorage.getItem("adminJWT");
  const userToken = localStorage.getItem("jwt");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminJWT");
    localStorage.removeItem("jwt");
    window.alert("Successfully logged out");
    navigate("/login");
  };

  return (
    <nav>
      <ul className="navbar">
        {/* if signed in as a regular user */}
        {!adminToken && (
          <li>
            <Link to={userToken ? "/customerHome" : "/"}>Home</Link>
          </li>
        )}

        {/* if not logged in show these */}
        {!userToken && !adminToken && (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}

        {/* if logged in as a regular user */}
        {userToken && (
          <>
            <li><Link to="/paymentPage">Make a Payment</Link></li>
            <li className="logout-btn">
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}

        {/* if logged in as an admin */}
        {adminToken && (
          <>
            <li><Link to="/adminDashboard">Admin Dashboard</Link></li>
            <li><Link to="/viewPayments">View Payments</Link></li>
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