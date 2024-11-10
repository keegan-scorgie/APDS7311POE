import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Payment Portal Website!</h1>
      <p className="intro-text">
        To get started, please use the navigation bar to <strong>Make a Payment</strong> or <strong>View Payment History</strong>!
      </p>
      <div className="cta">
        <p>Secure your payments today and enjoy seamless transactions.</p>
      </div>
    </div>
  );
};

export default Home;
