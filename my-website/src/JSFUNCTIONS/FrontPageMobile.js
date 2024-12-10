//Import necessary libraries and components
import React from "react"; // React library for building UI and useState for state management
import { Link } from "react-router-dom"; // Navigation components for routing
import "../App.css";
import darkSun from "../pictures/sun.png";
import sun from "../pictures/sunBright.png";
import "../APictures.css";
import { setGlobalState, useGlobalState } from "../GlobalVars"; // Global state management functions

// Component for the mobile version of the front page
export function FrontPageMobile() {
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [headerColor] = useGlobalState("headerColor");
  const [darkMode] = useGlobalState("DarkMode");
  const [wordColor] = useGlobalState("wordColor");
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

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

  //Main functionality to render the page
  return (
    <div>
      <div className="page" style={{ backgroundColor: backgroundColor }}>
        <header className="header" style={{ backgroundColor: headerColor }}>
          {/* Register link positioned with margin and padding */}
          <span
            style={{
              marginRight: "1.1718vw",
              color: "white",
              fontSize: "2.377vh",
              paddingRight: "20px",
            }}
          >
            <Link
              to="/Register"
              style={{ color: wordColor, textDecoration: "none" }}
            >
              Register
            </Link>
          </span>
          <div>
            {/* Main title with dynamic text color */}
            <h1 className="frontPageTitle" style={{ color: wordColor }}>
              Movie Match
            </h1>
          </div>

          {/* Options in the header */}
          <div
            className="headerOptions"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            {/* Sign in link with dynamic text color */}
            <div style={{ paddingLeft: "15px" }}>
              <span
                style={{
                  color: "white",
                  fontSize: "2.377vh",
                }}
              >
                <Link
                  to="/Login"
                  style={{ color: wordColor, textDecoration: "none" }}
                >
                  Sign in
                </Link>
              </span>
            </div>

            {/* Dark mode toggle button */}
            <div style={{ paddingLeft: "5px" }}>
              {darkMode && (
                <img
                  src={darkSun}
                  alt="light mode"
                  className="dark_mode"
                  onClick={dark_mode}
                  style={{ height: "20px", width: "20px" }}
                ></img>
              )}
              {!darkMode && (
                <img
                  src={sun}
                  alt="dark mode"
                  className="dark_mode"
                  onClick={dark_mode}
                  style={{ height: "20px", width: "20px" }}
                ></img>
              )}
            </div>
          </div>
        </header>

        {/* Centered message below the header
          <h3
            style={{
              color: "#f0eee9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
              position: "relative",
            }}
          >
            WOOOOOO!!
          </h3>
  
           Display viewport dimensions 
          <h3>
            {viewportHeight} x {viewportWidth}
          </h3> */}
      </div>
    </div>
  );
}
