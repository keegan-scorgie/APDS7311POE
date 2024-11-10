import React from "react";
import { BrowserRouter as Router,Route,Routes} from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Register from "./components/register";
import Login from "./components/login";
import CustomerHome from "./components/customerHome";
import PaymentPage from "./components/paymentPage";
import './App.css';


const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/customerHome" element={<CustomerHome/>}/>
          <Route path="/paymentPage" element={<PaymentPage />}/>
          
          
        </Routes>
      
      </div>
    </Router>
  );
};

export default App;