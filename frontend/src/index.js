import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Use React 18's createRoot
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import SpellList from "./components/SpellList";
import FeatList from "./components/AdventuringFeatList";
import "./index.css";

console.log("Rendering Index.js"); // Debugging

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/spells" element={<SpellList />} />
            <Route path="/feats" element={<FeatList />} />
        </Routes>
    </Router>
);