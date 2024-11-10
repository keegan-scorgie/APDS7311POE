import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './payment.css';

export default function PaymentPage() {
  const [form, setForm] = useState({
    amount: '',
    transactionDate: '',
    name: '',
    bankReferenceNumber: '',
  });
  const [error, setError] = useState(""); 
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

 function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

async function onSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("jwt"); 
    if (!token) {
      setError("You must be logged in to make a payment.");
      return;
    }

    const newPayment = { ...form };
    let response;

    try {
      response = await fetch("https://localhost:3000/api/users/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(newPayment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred during payment.");
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setSuccessMessage(data.message || "Payment successful!"); 

 
      setForm({
        amount: '',
        transactionDate: '',
        name: '',
        bankReferenceNumber: '',
      });
      setError(""); 

    } catch (error) {
      console.error("Error during payment:", error);
      setError(error.message); 
    }
  }

  return (
    <div>
      <h3><u>Payment</u></h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            value={form.amount}
            onChange={(e) => updateForm({ amount: e.target.value })}
          />
        </div>

        <div className="form-group transaction-date" style={{ marginTop: '25px' }}>
    <label htmlFor="transactionDate">Transaction Date</label>
    <input
        type="date"
        className="form-control"
        id="transactionDate"
        value={form.transactionDate}
        onChange={(e) => updateForm({ transactionDate: e.target.value })}
    />
</div>

        <div className="form-group" style={{ marginTop: '25px' }}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bankReferenceNumber">Bank Reference Number</label>
          <input
            type="text"
            className="form-control"
            id="bankReferenceNumber"
            value={form.bankReferenceNumber}
            onChange={(e) => updateForm({ bankReferenceNumber: e.target.value })}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>} 
        {successMessage && <div className="alert alert-success">{successMessage}</div>} 

        <div className="form-group">
          <input
            type="submit"
            value="Submit Payment"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}