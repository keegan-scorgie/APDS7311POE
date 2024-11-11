import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admindashboard.css";  

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminJwt");  
    if (!adminToken) {
      navigate("/adminLogin");  // redirect to admin login if not authenticated
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Admin Dashboard!</h1>
      <p className="intro-text">
        As an admin, you can manage payments, view payment details, and oversee all transactions.
      </p>
      <div className="cta">
        <p>Use the navigation to access various admin tools.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;