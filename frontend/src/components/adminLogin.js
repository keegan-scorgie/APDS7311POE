import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [form, setForm] = useState({
        username: '', 
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

        const adminData = { ...form };
        let response;

        try {
            response = await fetch("https://localhost:3000/api/employees/login", {  // Updated endpoint for admin login
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(adminData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "An error occurred during login.");
                throw new Error(errorData.message);
            }

            const data = await response.json();
            const { token, username } = data;

            console.log(username + " " + token);

            localStorage.setItem("adminJWT", token); 
            setForm({ username: "", password: "" });
            setError(""); 

            navigate("/adminDashboard");  

        } catch (error) {
            console.error('Error during admin login:', error);
            setError(error.message); 
        }
    }

    return (
        <div>
            <h3><u>Admin Login</u></h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={form.username}
                        onChange={(e) => updateForm({ username: e.target.value })}
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