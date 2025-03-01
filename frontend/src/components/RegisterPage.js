import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/register/`,
                { username, email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Register success:", response);

            if (response.status === 201 || response.status === 200) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError("Unexpected response. Please try again.");
            }
        } catch (error) {
            console.error("Register error:", error.response ? error.response.data : error.message);
            setError("Registration failed. Try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
}

export default RegisterPage;
