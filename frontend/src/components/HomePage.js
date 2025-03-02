import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../ThemeContext"; 
import "./HomePage.css";

function HomePage() {
    const { darkMode, toggleTheme } = useContext(ThemeContext);

    return (
        <div className="home-container">
            {/* Dark Mode Toggle */}
            <div className="theme-toggle">
                <label className="switch">
                    <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
                    <span className="slider round"></span>
                </label>
                <span className="theme-label">{darkMode ? "Dark Mode" : "Light Mode"}</span>
            </div>

            {/* Page Title */}
            <h1 className="home-title">Illadrya Database</h1>

            {/* Navigation Links */}
                   <div className="nav-links">
                    <Link to="/spells" className="nav-link">Spells</Link>
                    <Link to="/feats" className="nav-link">Adventuring Feats</Link>
            </div>
        </div>
    );
}

export default HomePage;
