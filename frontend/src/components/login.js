import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const [form, setForm] = useState({
        accountNumber: '',
        password: ''
    });
    const [error, setError] = useState(""); 

    const navigate = useNavigate();

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        const newUser = { ...form };
        let response;

        try {
            response = await fetch("https://localhost:3000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "An error occurred during login.");
                throw new Error(errorData.message);
            }

            const data = await response.json();
            const { token, accountNumber } = data;

            console.log(accountNumber + " " + token);

            localStorage.setItem("jwt", token);
            setForm({ accountNumber: "", password: "" });
            setError(""); 

            navigate("/customerHome");

        } catch (error) {
            console.error('Error during login:', error);
            setError(error.message); 
        }
    }

    return (
        <div>
            <h3><u>Login</u></h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="accountNumber">Account Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="accountNumber"
                        value={form.accountNumber}
                        onChange={(e) => updateForm({ accountNumber: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password" 
                        className="form-control"
                        id="password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>} 
                <div className="form-group">
                    <input
                        type="submit"
                        value="Login"
                        className="btn "
                    />
                </div>
            </form>
        </div>
    );
}