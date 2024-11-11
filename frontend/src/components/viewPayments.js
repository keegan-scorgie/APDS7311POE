import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewPayments = () => {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('adminJWT');

        if (!token) {
            setError('No admin token found. Please log in again.');
            return;
        }

        axios.get('https://localhost:3000/api/viewpayment', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setPayments(response.data);
        })
        .catch(error => {
            console.error('Error fetching payments:', error);
            setError('An error occurred while fetching payments.');
        });
    }, []);

    const handleConfirmPayment = async (paymentId) => {
        const token = localStorage.getItem("adminJWT");
        if (!token) {
            alert("You must be logged in to confirm payments.");
            return;
        }
    
        try {
            const response = await axios.put(`https://localhost:3000/api/confirmPayment/${paymentId}`, 
            { paymentStatus: 'confirmed' }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
            });
    
            if (response.status === 200) {
                alert("Payment confirmed successfully.");
                setPayments(payments.map(payment => 
                    payment._id === paymentId ? { ...payment, paymentStatus: 'confirmed' } : payment
                ));
            }
        } catch (error) {
            console.error("Error confirming payment:", error.response ? error.response.data : error.message);
            alert("Error confirming payment.");
        }
    };

    return (
        <div>
            <h2>View All Payments</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>SWIFT Code</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length > 0 ? (
                        payments.map((payment) => (
                            <tr key={payment._id}>
                                <td>{payment.name}</td>
                                <td>${payment.amount}</td>
                                <td>{payment.swiftCode}</td>
                                <td>{payment.paymentStatus}</td>
                                <td>
                                    <button onClick={() => handleConfirmPayment(payment._id)}>
                                        Confirm Payment
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No payments available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ViewPayments;