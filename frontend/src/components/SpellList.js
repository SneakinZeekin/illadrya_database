import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SpellList.css";

function SpellList() {
  const [spells, setSpells] = useState([]);
  const [filteredSpells, setFilteredSpells] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("spell_level");
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter states
  const [filters, setFilters] = useState({
    class: "All",
    level: "All",
    school: "All",
    castingTime: "All",
    ritual: "All",
    concentration: "All",
  });

  useEffect(() => {
    // Fetch spell data
    axios.get("http://127.0.0.1:8000/api/spells/")
      .then((response) => {
        setSpells(response.data);
        setFilteredSpells(response.data);
      })
      .catch((error) => console.error("Error fetching spells:", error));
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/classes/")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setAvailableClasses(response.data.sort((a, b) => a.class_name.localeCompare(b.class_name)));
        } else {
          console.error("Unexpected API response format for classes:", response.data);
          setAvailableClasses([]);
        }
      })
      .catch((error) => console.error("Error fetching classes:", error));
  }, []);

  // Filter and search logic
  useEffect(() => {
    const filtered = spells.filter(spell => {
        return (
            (search === "" || spell.spell_name.toLowerCase().includes(search.toLowerCase())) &&
            (filters.class === "All" || (
                Array.isArray(spell.classes) && 
                spell.classes.some(cls => cls === filters.class)
            )) &&
            (filters.level === "All" || spell.spell_level.toString() === filters.level) &&
            (filters.school === "All" || spell.spell_school === filters.school) &&
            (filters.castingTime === "All" || spell.spell_casting_time === filters.castingTime) &&
            (filters.ritual === "All" || (filters.ritual === "Yes" ? spell.spell_ritual : !spell.spell_ritual)) &&
            (filters.concentration === "All" || (filters.concentration === "Yes" ? spell.spell_concentration : !spell.spell_concentration))
        );
    });

    setFilteredSpells(filtered);
}, [search, spells, filters]);



  // Toggle spell description visibility
  const toggleDescription = (index) => {
    setFilteredSpells((prevSpells) =>
      prevSpells.map((spell, i) =>
        i === index ? { ...spell, expanded: !spell.expanded } : spell
      )
    );
  };

  // Sorting Logic
  const handleSort = (column) => {
    let newDirection = "asc";

    if (sortBy === column) {
      newDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    setSortBy(column);
    setSortDirection(newDirection);

    setFilteredSpells((prevSpells) =>
      [...prevSpells].sort((a, b) => {
        let valueA = a[column];
        let valueB = b[column];

        if (typeof valueA === "string") valueA = valueA.toLowerCase();
        if (typeof valueB === "string") valueB = valueB.toLowerCase();

        if (valueA < valueB) return newDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return newDirection === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  // Function to update filters
  const updateFilter = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // Function to reset all filters
  const resetFilters = () => {
    setFilters({
      class: "All",
      level: "All",
      school: "All",
      castingTime: "All",
      ritual: "All",
      concentration: "All",
    });
    setSearch("");
  };

  // Function to convert numbers into ordinal format (1st, 2nd, 3rd, 4th, etc.)
  const getOrdinal = (num) => {
    if (num === 0) return "Cantrip";
    if (num === 1) return "1st";
    if (num === 2) return "2nd";
    if (num === 3) return "3rd";
    return `${num}th`;
  };


  return (
    <div className="container">
      <h1>Illadrya Spells</h1>

      {/* Search Bar & Filters */}
      <div className="search-filter-container">
        {/* Search Bar and Reset Button */}
        <div className="search-bar-container">
          <input
            type="text"
            id="search-bar"
            placeholder="Search Spells"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="reset-filters" onClick={resetFilters}>Reset Filters</button>
        </div>

        {/* Filters Container */}
        <div className="filters-container">
          <div className="filter-group">
            <div className="filter-item">
              <label>Class</label>
              <select value={filters.class} onChange={(e) => updateFilter("class", e.target.value)}>
                <option value="All">All</option>
                {availableClasses.length > 0 ? (
                  availableClasses.map((cls, index) => (
                    <option key={index} value={cls.class_name}>{cls.class_name}</option>
                  ))
                ) : (
                  <option disabled>Loading...</option>
                )}
              </select>
            </div>


            <div className="filter-item">
              <label>Spell Level</label>
              <select value={filters.level} onChange={(e) => updateFilter("level", e.target.value)}>
                <option value="All">All</option>
                {[...Array(10).keys()].map(level => (
                  <option key={level} value={level}>
                    {getOrdinal(level)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>Spell School</label>
              <select value={filters.school} onChange={(e) => updateFilter("school", e.target.value)}>
                <option value="All">All</option>
                <option value="Abjuration">Abjuration</option>
                <option value="Conjuration">Conjuration</option>
                <option value="Divination">Divination</option>
                <option value="Enchantment">Enchantment</option>
                <option value="Evocation">Evocation</option>
                <option value="Illusion">Illusion</option>
                <option value="Necromancy">Necromancy</option>
                <option value="Transmutation">Transmutation</option>
              </select>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-item">
              <label>Casting Time</label>
              <select value={filters.castingTime} onChange={(e) => updateFilter("castingTime", e.target.value)}>
                <option value="All">All</option>
                <option value="1 Action">1 Action</option>
                <option value="1 Bonus Action">1 Bonus Action</option>
                <option value="1 Reaction">1 Reaction</option>
                <option value="1 Minute">1 Minute</option>
                <option value="10 Minutes">10 Minutes</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Ritual</label>
              <select value={filters.ritual} onChange={(e) => updateFilter("ritual", e.target.value)}>
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Concentration</label>
              <select value={filters.concentration} onChange={(e) => updateFilter("concentration", e.target.value)}>
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>
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
            <div className="spell-level">{getOrdinal(spell.spell_level)}</div>
            <div className="spell-name-container">
              <span className="spell-name">
                {spell.spell_name}
                {spell.spell_concentration && <span className="tag">C</span>}
                {spell.spell_ritual && <span className="tag">R</span>}
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
