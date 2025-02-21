import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const App = () => {
    // Get stored theme preference
    const storedTheme = localStorage.getItem("theme") || "dark";
    const [darkMode, setDarkMode] = useState(storedTheme === "dark");

    // Apply the theme on component mount
    useEffect(() => {
        document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    // Toggle theme function
    const toggleTheme = () => {
        const newTheme = darkMode ? "light" : "dark";
        setDarkMode(!darkMode);
        localStorage.setItem("theme", newTheme);
        document.body.setAttribute("data-theme", newTheme);
    };

    return (
        <div className="container">
            {/* Theme Toggle Switch */}
            <div className="theme-toggle">
                <label className="switch">
                    <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
                    <span className="slider round"></span>
                </label>
                <span className="theme-label">{darkMode ? "Dark Mode" : "Light Mode"}</span>
            </div>

            {/* Main Title */}
            <h1 className="main-title">Illadrya Database</h1>

            {/* Navigation Links */}
            <div className="nav-links">
                <Link to="/spells" className="nav-link">Spells</Link>
                <Link to="/feats" className="nav-link">Adventuring Feats</Link>
            </div>
        </div>
    );
};

export default App;