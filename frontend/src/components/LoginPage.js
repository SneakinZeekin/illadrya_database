import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage({ setToken }) { 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
            console.error("Login error:", error.response ? error.response.data : error.message);
            setError("Invalid username or password.");
        }
    };    

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    );
}

export default LoginPage;
