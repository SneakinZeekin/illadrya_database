import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../ThemeContext";
import "./RegisterPage.css";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [usernameExists, setUsernameExists] = useState(null);
    const [usernameLength, setUsernameLength] = useState(null);
    const [emailAvailable, setEmailAvailable] = useState(null);
    const [emailExists, setEmailExists] = useState(false);
    const [passwordValid, setPasswordValid] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const { darkMode, toggleTheme } = useContext(ThemeContext);

    const checkUsername = async (value) => {
        setUsername(value);
        setUsernameExists(false);
    
        if (value.trim() === "") {
            setUsernameAvailable(null);
            setUsernameLength(null);
            return;
        }
    
        if (value.length < 4) {
            setUsernameAvailable(false);
            setUsernameLength(false);
            return;
        } else {
            setUsernameLength(true);
        }
    
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/check-username/?username=${value}`);
            setUsernameAvailable(response.data.available);
            if (!response.data.available) {
                setUsernameExists(true);
            }
        } catch (error) {
            setUsernameAvailable(false);
        }
    };

    const checkEmail = async (value) => {
        setEmail(value);
        setEmailExists(false);

        if (value.trim() === "") {
            setEmailAvailable(null);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailAvailable(false);
            return;
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/check-email/?email=${value}`);
            setEmailAvailable(response.data.available);
            if (!response.data.available) {
                setEmailExists(true);
            }
        } catch (error) {
            setEmailAvailable(false);
        }
    };

    const checkPassword = (value) => {
        setPassword(value);

        if (value.trim() === "") {
            setPasswordValid(null);
            return;
        }

        if (value.length < 8) {
            setPasswordValid(false);
        } else {
            setPasswordValid(true);
        }
    };


    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!usernameAvailable || !emailAvailable) {
            setError("Please choose a valid username and email before registering.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/register/`,
                { username, email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 201) {
                setSuccess("Registration successful! Check your email to verify your account.");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setError("Unexpected error. Please try again.");
            }
        } catch (error) {
            setError("Registration failed. Try again.");
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

            <div className="auth-container">
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={handleRegister} className="vertical-form">
                    {/* Username Field */}
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => checkUsername(e.target.value)}
                            required
                        />
                        {usernameAvailable === true && <span className="valid">✔</span>}
                        {usernameAvailable === false && usernameLength !== null && <span className="invalid">✖</span>}
                    </div>
                    {usernameLength === false && <p className="error-message-reg">Username must be at least 4 characters long.</p>}
                    {usernameExists === true && <p className="error-message-reg">This username is already taken.</p>}

                    {/* Email Field */}
                    <div className="input-group">
                        <input type="email" placeholder="Email" value={email} onChange={(e) => checkEmail(e.target.value)} required />

                        {emailAvailable === true && <span className="valid">✔</span>}
                        {emailAvailable === false && email.trim() !== "" && <span className="invalid">✖</span>}
                    </div>
                    {email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (<p className="error-message-reg">Enter a valid email address.</p>)}
                    {emailExists && <p className="error-message-reg">This email is already in use.</p>}

                    {/* Password Field */}
                    <div className="input-group">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => checkPassword(e.target.value)} required />

                        {passwordValid === true && <span className="valid">✔</span>}
                        {passwordValid === false && password.length > 0 && <span className="invalid">✖</span>}
                    </div>
                    {passwordValid === false && password.length > 0 && (<p className="error-message-reg">Password must be at least 8 characters long.</p>)}

                    {/* Register Button */}
                    <button type="submit" disabled={!usernameAvailable || !emailAvailable}>Register</button>
                </form>
                <p className="auth-links">Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
}

export default RegisterPage;
