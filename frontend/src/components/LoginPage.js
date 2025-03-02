import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../ThemeContext";

function LoginPage({ setToken }) { 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { darkMode, toggleTheme } = useContext(ThemeContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        console.log("Attempting login with:", username, password);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/login/`,
                { username, password },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Login success:", response.data);

            const { token } = response.data;
            setToken(token); 
            localStorage.setItem("authToken", token);
            navigate("/");
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    setError("Please verify your email before logging in."); 
                } else if (error.response.status === 400) {
                    setError("Invalid username or password.");
                }
                else {
                    setError("An error occurred. Please try again.");
                }
            }
        }
    };    

    return (
        <div className="auth-page">
            {/* Dark Mode Toggle */}
            <div className="theme-toggle">
                <label className="switch">
                    <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
                    <span className="slider round"></span>
                </label>
                <span className="theme-label">{darkMode ? "Dark Mode" : "Light Mode"}</span>
            </div>

            {/* Page Title */}
            <h1 className="auth-title">Illadrya Database</h1>

            {/* Login Form */}
            <div className="auth-container">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin} className="vertical-form">
                    <div className="input-group">
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <button type="submit">Login</button>
                </form>
                <p className="auth-links">Don't have an account? <a href="/register">Register</a></p>
            </div>
        </div>
    );
}

export default LoginPage;
