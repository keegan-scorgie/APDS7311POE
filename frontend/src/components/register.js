import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        fullName: '',
        idNumber: '',
        accountNumber: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    // some validation over here
    function validateForm() {
        let formErrors = {};
        
       
        if (!form.fullName.trim()) {
            formErrors.fullName = "Full Name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(form.fullName)) {
            formErrors.fullName = "Full Name can only contain letters and spaces.";
        }

       
        if (!form.idNumber.trim()) {
            formErrors.idNumber = "ID Number is required.";
        } else if (!/^[a-zA-Z0-9]{8,12}$/.test(form.idNumber)) {
            formErrors.idNumber = "ID Number must be alphanumeric and 8-12 characters long.";
        }

     
        if (!form.accountNumber.trim()) {
            formErrors.accountNumber = "Account Number is required.";
        } else if (!/^\d{10}$/.test(form.accountNumber)) {
            formErrors.accountNumber = "Account Number must be a 10-digit number.";
        }

        
        if (!form.password) {
            formErrors.password = "Password is required.";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(form.password)) {
            formErrors.password = "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    }

    async function onSubmit(e) {
        e.preventDefault();

        
        if (!validateForm()) {
            return;
        }

        const newUser = { ...form };

        try {
            const response = await fetch("https://localhost:3000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                setForm({ fullName: "", idNumber: "", accountNumber: "", password: "" });
                alert("Registration successful!");
                navigate("/login");
            } else {
                const errorMessage = await response.json();
                window.alert(errorMessage.message || "Failed to register user.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            window.alert("An error occurred. Please try again.");
        }
    }

    return (
        <div>
            <h3><u>Register</u></h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input 
                        type="text"
                        className="form-control"
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) => updateForm({ fullName: e.target.value })}
                        required
                    />
                    {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
                </div>
            
                <div className="form-group">
                    <label htmlFor="idNumber">ID Number</label>
                    <input 
                        type="text"
                        className="form-control"
                        id="idNumber"
                        value={form.idNumber}
                        onChange={(e) => updateForm({ idNumber: e.target.value })}
                        required
                    />
                    {errors.idNumber && <small className="text-danger">{errors.idNumber}</small>}
                </div>

                <div className="form-group">
                    <label htmlFor="accountNumber">Account Number</label>
                    <input 
                        type="text"
                        className="form-control"
                        id="accountNumber"
                        value={form.accountNumber}
                        onChange={(e) => updateForm({ accountNumber: e.target.value })}
                        required
                    />
                    {errors.accountNumber && <small className="text-danger">{errors.accountNumber}</small>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password"
                        className="form-control"
                        id="password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                        required
                    />
                    {errors.password && <small className="text-danger">{errors.password}</small>}
                </div>

                <div className="form-group">
                    <input
                        type="submit"
                        value="Register"
                        className="btn "
                    />
                </div>
            </form>
        </div>
    );
}