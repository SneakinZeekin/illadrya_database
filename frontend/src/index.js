import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import App from "./App";
import SpellList from "./components/SpellList";
import FeatList from "./components/AdventuringFeatList";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/spells" element={<SpellList />} />
                <Route path="/feats" element={<FeatList />} />
            </Routes>
        </Router>
    </ThemeProvider>
);
