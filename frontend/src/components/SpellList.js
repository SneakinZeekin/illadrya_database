import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SpellList.css"; // Ensure you add the styles in a separate file

const API_URL = "http://127.0.0.1:8000/api/spells/";

function SpellList() {
  const [spells, setSpells] = useState([]);
  const [filteredSpells, setFilteredSpells] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("spell_level");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setSpells(response.data);
        setFilteredSpells(response.data);
      })
      .catch((error) => console.error("Error fetching spells:", error));
  }, []);

  // Toggle spell description visibility
  const toggleDescription = (index) => {
    setFilteredSpells((prevSpells) =>
      prevSpells.map((spell, i) =>
        i === index ? { ...spell, expanded: !spell.expanded } : spell
      )
    );
  };

  // Handle Search
  useEffect(() => {
    const filtered = spells.filter((spell) =>
      spell.spell_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSpells(filtered);
  }, [search, spells]);

  // Sorting Logic
  const handleSort = (column) => {
    let newDirection = "asc";
  
    if (sortBy === column) {
      newDirection = sortDirection === "asc" ? "desc" : "asc";
    }
  
    setSortBy(column);
    setSortDirection(newDirection);
  
    // Ensure sorting happens immediately after state updates
    setFilteredSpells((prevSpells) => {
      return [...prevSpells].sort((a, b) => {
        let valueA = a[column];
        let valueB = b[column];
  
        // Handle numbers and strings separately
        if (typeof valueA === "string") valueA = valueA.toLowerCase();
        if (typeof valueB === "string") valueB = valueB.toLowerCase();
  
        if (valueA < valueB) return newDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return newDirection === "asc" ? 1 : -1;
        return 0;
      });
    });
  };

  return (
    <div className="container">
      <h1>Illadrya Spells</h1>

      {/* Search Bar */}
      <div className="search-filter-container">
        <input
          type="text"
          id="search-bar"
          placeholder="Spell Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Spell List */}
      <div className="spell-list">
        <div className="spell-list-header">
          <div className="spell-icon-header"></div>
          <div className="list-header sortable" onClick={() => handleSort("spell_level")}>
            Level {sortBy === "spell_level" && (sortDirection === "asc" ? "▲" : "▼")}
          </div>
          <div className="list-header sortable" onClick={() => handleSort("spell_name")}>
            Name {sortBy === "spell_name" && (sortDirection === "asc" ? "▲" : "▼")}
          </div>
          <div className="list-header sortable" onClick={() => handleSort("spell_school")}>
            School {sortBy === "spell_school" && (sortDirection === "asc" ? "▲" : "▼")}
          </div>
          <div className="list-header sortable" onClick={() => handleSort("spell_casting_time")}>
            Casting Time {sortBy === "spell_casting_time" && (sortDirection === "asc" ? "▲" : "▼")}
          </div>
          <div className="list-header sortable" onClick={() => handleSort("spell_duration")}>
            Duration {sortBy === "spell_duration" && (sortDirection === "asc" ? "▲" : "▼")}
          </div>
          <div className="spell-expand-header"></div>
        </div>

        {filteredSpells.map((spell, index) => (
          <div key={spell.spell_name} className={`spell-card ${spell.expanded ? "expanded" : ""}`} onClick={() => toggleDescription(index)}>
            <div className="spell-icon">
              <span className="icon-placeholder">{spell.spell_school.charAt(0)}</span>
            </div>
            <div className="spell-level">{spell.spell_level === 0 ? "Cantrip" : `${spell.spell_level}th`}</div>
            <div className="spell-name-container">
              <span className="spell-name">
                {spell.spell_name}
                {spell.spell_concentration && <span className="tag">(C)</span>}
                {spell.spell_ritual && <span className="tag">(R)</span>}
              </span>
              <span className="spell-components">{spell.spell_components || "None"}</span>
            </div>
            <div className="spell-school">{spell.spell_school}</div>
            <div className="spell-casting">{spell.spell_casting_time}</div>
            <div className="spell-duration">{spell.spell_duration}</div>
            <div className="spell-expand">{spell.expanded ? "−" : "+"}</div>

            {spell.expanded && (
              <div className="spell-description">
                <div dangerouslySetInnerHTML={{ __html: spell.spell_description || "No description available." }}></div>
                {spell.spell_materials && (
                  <div className="spell-materials">
                    <i>* - ({spell.spell_materials})</i>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpellList;
