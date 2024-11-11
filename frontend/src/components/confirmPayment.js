import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConfirmPayment = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://localhost:3000/api/viewpayment', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setPayments(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching payments:', error);
            setLoading(false);
        });
    }, []);

    const confirmPayment = (paymentId) => {
        const confirmed = window.confirm('Are you sure you want to confirm this payment?');
        if (confirmed) {
            axios.put(`https://localhost:3000/api/confirmPayment/${paymentId}`, {
                paymentStatus: 'confirmed'
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                alert('Payment status updated successfully!');
                setPayments(payments.map(payment => 
                    payment._id === paymentId ? { ...payment, paymentStatus: 'confirmed' } : payment
                ));
            })
            .catch(error => {
                console.error('Error confirming payment:', error);
                alert('Failed to update payment status');
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Confirm Payments</h2>
            <ul>
                {payments.map(payment => (
                    <li key={payment._id}>
                        <p>Name: {payment.name}</p>
                        <p>Amount: ${payment.amount}</p>
                        <p>SWIFT Code: {payment.swiftCode}</p>
                        <p>Status: {payment.paymentStatus}</p>
                        <button onClick={() => confirmPayment(payment._id)}>
                            Confirm Payment
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConfirmPayment;