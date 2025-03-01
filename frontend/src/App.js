import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SpellList from "./components/SpellList";
import FeatList from "./components/AdventuringFeatList";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import "./App.css";

function App() {
    const [token, setToken] = useState(localStorage.getItem("authToken") || "");

    useEffect(() => {
        localStorage.setItem("authToken", token);
    }, [token]);

    const handleLogout = () => {
        setToken("");
        localStorage.removeItem("authToken");
    };

    return (
        <>
            {token && (
                <div className="logout-container">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}

            <Routes>
                {!token ? (
                    <>
                        <Route path="/login" element={<LoginPage setToken={setToken} />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<SpellList />} />
                        <Route path="/spells" element={<SpellList />} />
                        <Route path="/feats" element={<FeatList />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                )}
            </Routes>
        </>
    );
}

export default App;
