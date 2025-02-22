import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import "./AdventuringFeatList.css";

function AdventuringFeatList() {
    const [feats, setFeats] = useState([]);
    const [filteredFeats, setFilteredFeats] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("feat_name");
    const [sortDirection, setSortDirection] = useState("asc");
    const {darkMode, toggleTheme} = useContext(ThemeContext);

    // Filters
    const [skillFilter, setSkillFilter] = useState("All");
    const [toolFilter, setToolFilter] = useState("All");
    const [classFilter, setClassFilter] = useState("All");
    const [spellcastingFilter, setSpellcastingFilter] = useState("All");

    const [skillOptions, setSkillOptions] = useState([]);
    const [toolOptions, setToolOptions] = useState([]);
    const [classOptions, setClassOptions] = useState([]);
    const [spellOptions, setSpellOptions] = useState([]);

    // Fetch feats from API
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/adventuring-feats/feats/`)
            .then(response => {
                const featsData = response.data;
                setFeats(featsData);
                setFilteredFeats(featsData);

                const skills = new Set();
                const tools = new Set();
                const classes = new Set();
                const spells = new Set();

                featsData.forEach(feat => {
                    feat.prerequisites.forEach(prereq => {
                        if (prereq.category === "Skill Proficiency") {
                            skills.add(prereq.value);
                        } else if (prereq.category === "Tool Proficiency") {
                            tools.add(prereq.value);
                        } else if (prereq.category === "Class") {
                            classes.add(prereq.value);
                        } else if (prereq.category === "Spellcasting"){
                            spells.add(prereq.value);
                        }
                    });
                });

                setSkillOptions(Array.from(skills).sort());
                setToolOptions(Array.from(tools).sort());
                setClassOptions(Array.from(classes).sort());
                setSpellOptions(Array.from(spells).sort());
            })
            .catch(error => console.error("Error fetching feats:", error));
    }, []);

     // Filtering Logic
     useEffect(() => {
        let filtered = feats.filter(feat => {
            let matchesSearch = search === "" || feat.feat_name.toLowerCase().includes(search.toLowerCase());
            let matchesSkill = skillFilter === "All" || feat.prerequisites.some(p => p.category === "Skill Proficiency" && p.value === skillFilter);
            let matchesTool = toolFilter === "All" || feat.prerequisites.some(p => p.category === "Tool Proficiency" && p.value === toolFilter);
            let matchesClass = classFilter === "All" || feat.prerequisites.some(p => p.category === "Class" && p.value === classFilter);
            let matchesSpellcasting = spellcastingFilter === "All" || feat.prerequisites.some(p => p.category === "Spellcasting" && p.value === spellcastingFilter);

            return matchesSearch && matchesSkill && matchesTool && matchesClass && matchesSpellcasting;
        });

        setFilteredFeats(filtered);
    }, [search, skillFilter, toolFilter, classFilter, spellcastingFilter, feats]);

    const toggleDescription = (index) => {
        setFilteredFeats((prevFeats) =>
            prevFeats.map((feat, i) =>
                i === index ? { ...feat, expanded: !feat.expanded } : feat
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

        setFilteredFeats((prevFeats) =>
            [...prevFeats].sort((a, b) => {
                let valueA = a[column];
                let valueB = b[column];

                if (column === "feat_prereqs") {
                    valueA = a.prerequisites.map(p => p.value).join(", ") || "";
                    valueB = b.prerequisites.map(p => p.value).join(", ") || "";
                }

                if (typeof valueA === "string") valueA = valueA.toLowerCase();
                if (typeof valueB === "string") valueB = valueB.toLowerCase();

                if (valueA < valueB) return newDirection === "asc" ? -1 : 1;
                if (valueA > valueB) return newDirection === "asc" ? 1 : -1;
                return 0;
            })
        );
    };

    const resetFilters = () => {
        setSearch("");
        setSkillFilter("All");
        setToolFilter("All");
        setClassFilter("All");
        setSpellcastingFilter("All");
    };

    const formatPrerequisites = (prerequisites) => {
        const classes = [];
        const skills = [];
        const tools = [];
        let hasSpellcasting = false;
    
        prerequisites.forEach((prereq) => {
            if (prereq.category === "Class") {
                classes.push(prereq.value);
            } else if (prereq.category === "Skill Proficiency") {
                skills.push(prereq.value);
            } else if (prereq.category === "Tool Proficiency") {
                if (prereq.value === "Musical Instrument") {
                    tools.push("at least one Musical Instrument");
                } else if (prereq.value === "Gambling Set") {
                    tools.push("at least one Gambling Set");
                } else {
                    tools.push(prereq.value);
                }
            } else if (prereq.category === "Spellcasting") {
                hasSpellcasting = true;
            }
        });
    
        let classText = "";
        if (classes.length > 0) {
            if (classes.length === 1) {
                classText = classes[0];
            } else if (classes.length === 2) {
                classText = `${classes[0]} or ${classes[1]}`;
            } else {
                classText = `${classes.slice(0, -1).join(", ")}, or ${classes[classes.length - 1]}`;
            }
        }

        let skillText = "";
        if (skills.length > 0) {
            if (skills.length === 1) {
                skillText = `Proficiency in ${skills[0]}`
            } else if (classes.length === 2) {
                skillText = `Proficiency in ${skills[0]} or ${skills[1]}`;
            } else {
                skillText = `Proficiency in ${skills.slice(0, -1).join(", ")}, or ${skills[skills.length - 1]}`;
            }
        }

        let toolText = "";
        if (tools.length > 0) {
            if (tools.length === 1) {
                toolText = `Proficiency with ${tools[0]}`
            } else if (classes.length === 2) {
                toolText = `Proficiency with ${tools[0]} or ${tools[1]}`;
            } else {
                toolText = `Proficiency with ${tools.slice(0, -1).join(", ")}, or ${tools[tools.length - 1]}`;
            }
        }
    
        let spellcastingText = hasSpellcasting ? "The ability to cast at least one spell" : "";
    
        const prereqList = [classText, skillText, toolText, spellcastingText].filter(Boolean);

        let output = ""
        if (prereqList.length > 0){
            output = "<b>Prerequisite:</b> " + prereqList.join(", ");
        }

        return output;
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

            {/* Navigation Links */}
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/spells" className="nav-link">Spells</Link>
            </div>

            <h1>Adventuring Feats</h1>

            {/* Search Bar & Filters */}
            <div className="search-filter-container">
                {/* Search Bar and Reset Button */}
                <div className="search-bar-container">
                    <input
                        type="text"
                        id="search-bar"
                        placeholder="Search Feats"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="reset-filters" onClick={resetFilters}>Reset Filters</button>
                </div>

                {/* Filters Container */}
                <div className="filters-container">
                    <div className="filter-group">
                        <div className="filter-item">
                            <label>Skill Proficiency</label>
                            <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
                                <option value="All">All</option>
                                {skillOptions.map((skill) => (
                                    <option key={skill} value={skill}>{skill}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>Tool Proficiency</label>
                            <select value={toolFilter} onChange={(e) => setToolFilter(e.target.value)}>
                                <option value="All">All</option>
                                {toolOptions.map((tool) => (
                                    <option key={tool} value={tool}>{tool}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filter-group">
                        <div className="filter-item">
                            <label>Class</label>
                            <select value={classFilter} onChange={(e) => setToolFilter(e.target.value)}>
                                <option value="All">All</option>
                                {classOptions.map((class_) => (
                                    <option key={class_} value={class_}>{class_}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>Spellcasting</label>
                            <select value={spellcastingFilter} onChange={(e) => setSpellcastingFilter(e.target.value)}>
                                <option value="All">All</option>
                                {spellOptions.map((spell) => (
                                    <option key={spell} value={spell}>{spell}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feat Cards */}
            <div className="feat-list">
                <div className="feat-list-header">
                    <div className="feat-icon-header"></div>
                    <div className="list-header sortable" onClick={() => handleSort("feat_name")}>
                        Name {sortBy === "feat_name" && (sortDirection === "asc" ? "▲" : "▼")}
                    </div>
                    <div className="list-header sortable" onClick={() => handleSort("feat_prereqs")}>
                        Prerequisites {sortBy === "feat_prereqs" && (sortDirection === "asc" ? "▲" : "▼")}
                    </div>
                    <div className="feat-expand-header"></div>
                </div>

                {filteredFeats.map((feat, index) => (
                    <div key={feat.feat_name} className={`feat-card ${feat.expanded ? "expanded" : ""}`}>
                        <div className="feat-header" onClick={() => toggleDescription(index)}>
                            <div className="feat-icon">
                                <span className="icon-placeholder">{feat.feat_name.charAt(0)}</span>
                            </div>
                            <div className="feat-name-container">
                                <span className="feat-name">{feat.feat_name}</span>
                            </div>
                            <div className="feat-prerequisites">
                                {feat.prerequisites.length > 0 ? feat.prerequisites.map(p => p.value).join(", ") : ""}
                            </div>
                            <div className="feat-expand">{feat.expanded ? "−" : "+"}</div>
                        </div>

                        {
                            feat.expanded && (
                                <div className="feat-description">
                                    <div className="feat-details">
                                    <div className="feat-row">
                                            <div className="feat-section">
                                                <div className="feat-text" dangerouslySetInnerHTML={{ __html: formatPrerequisites(feat.prerequisites)}}></div>
                                            </div>
                                        </div>

                                        <hr className="feat-divider" />

                                        <div className="feat-row">
                                            <div className="feat-section">
                                                <div className="feat-text" dangerouslySetInnerHTML={{ __html: feat.formatted_description || "Loading description..." }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdventuringFeatList;
