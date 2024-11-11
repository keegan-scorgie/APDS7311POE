import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './paymentHistory.css'; 
export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // fetch the payments
    const token = localStorage.getItem("jwt");
    if (!token) {
      setError("You must be logged in to view your payment history.");
      navigate("/login");  // redirect users back to login if not logged in
      return;
    }

    const fetchPayments = async () => {
      try {
        const response = await fetch("https://localhost:3000/api/users/viewpayment", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "An error occurred while fetching payments.");
          throw new Error(errorData.message);
        }

        const data = await response.json();
        setPayments(data);  
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err.message);
      }
    };

    fetchPayments();
  }, [navigate]);

  return (
    <div>
      <h3><u>Payment History</u></h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {payments.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Transaction Date</th>
              <th>Name</th>
              <th>Bank Reference Number</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.amount}</td>
                <td>{payment.transactionDate}</td>
                <td>{payment.name}</td>
                <td>{payment.bankReferenceNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payments found.</p>
      )}
    </div>
  );
}