import React from "react"; // React library for building UI and useState for state management
import { Link } from "react-router-dom"; // Navigation components for routing
import "../App.css"; 
import darkSun from "../pictures/sun.png"; 
import sun from "../pictures/sunBright.png"; 
import MovieMatchIcon from "../pictures/MovieMatchIcon.png";
import "../APictures.css"; 
import { setGlobalState, useGlobalState } from "../GlobalVars"; // Global state management functions

export function FrontPage() {
  // Use global state for theme and color settings
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [headerColor] = useGlobalState("headerColor");
  const [darkMode] = useGlobalState("DarkMode");
  const [wordColor] = useGlobalState("wordColor");

  // Function to toggle dark mode
  function dark_mode() {
    if (darkMode) {
      setGlobalState("DarkMode", false);
      setGlobalState("headerColor", "#708090");
      setGlobalState("wordColor", "black");
      setGlobalState("backgroundColor", "#f0eee9");
    } else {
      setGlobalState("DarkMode", true);
      setGlobalState("headerColor", "#07000f");
      setGlobalState("wordColor", "white");
      setGlobalState("backgroundColor", "#1f2833");
    }
  }

  return (
    <div>
      {/* Main page container with dynamic background color */}
      <div className="page" style={{ backgroundColor: backgroundColor }}>
        {/* Header section */}
        <header
          className="header"
          style={{
            backgroundColor: headerColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 20px",
          }}
        >
          {/* Left section with icon */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={MovieMatchIcon}
              alt="Movie Match Icon"
              className="icon"
              style={{ width: "50px", height: "50px", marginRight: "10px" }}
            />
            <h1
              className="frontPageTitle"
              style={{ color: wordColor, margin: 0 }}
            >
              Movie Match
            </h1>
          </div>

          {/* Right section with links and dark mode toggle */}
          <div
            className="headerOptions"
            style={{ display: "flex", alignItems: "center", gap: "15px" }}
          >
            <span style={{ color: "white", fontSize: "2.377vh" }}>
              <Link
                to="/Register"
                className="navLinks"
                style={{ color: wordColor, textDecoration: "none" }}
              >
                Register
              </Link>
            </span>
            <span style={{ color: "white", fontSize: "2.377vh" }}>
              <Link
                to="/Login"
                className="navLinks"
                style={{ color: wordColor, textDecoration: "none" }}
              >
                Sign in
              </Link>
            </span>
            <div>
              {/* Dark mode toggle button */}
              {darkMode ? (
                <img
                  src={darkSun}
                  alt="light mode"
                  className="dark_mode"
                  onClick={dark_mode}
                  style={{ width: "30px", cursor: "pointer" }}
                />
              ) : (
                <img
                  src={sun}
                  alt="dark mode"
                  className="dark_mode"
                  onClick={dark_mode}
                  style={{ width: "30px", cursor: "pointer" }}
                />
              )}
            </div>
          </div>
        </header>
      </div>
      
    </div>
  );
}
