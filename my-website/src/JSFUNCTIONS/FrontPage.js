
//Import necessary libraries and components
import React from "react"; // React library for building UI and useState for state management
import { Link } from "react-router-dom"; // Navigation components for routing
import "../App.css"; 
import darkSun from "../pictures/sun.png"; 
import sun from "../pictures/sunBright.png"; 
import "../APictures.css"; 
import { setGlobalState, useGlobalState } from "../GlobalVars"; // Global state management functions



// Component for the front page of the website
export function FrontPage() {
    // Use global state for theme and color settings
    const [backgroundColor] = useGlobalState("backgroundColor");
    const [headerColor] = useGlobalState("headerColor");
    const [darkMode] = useGlobalState("DarkMode");
    const [wordColor] = useGlobalState("wordColor");
  
    // Get the viewport dimensions
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
  
    // Function to toggle dark mode
    function dark_mode() {
      if (darkMode) {// If dark mode is enabled, disable it and update global state
        setGlobalState("DarkMode", false);
        setGlobalState("headerColor", "#708090");
        setGlobalState("wordColor", "black");
        setGlobalState("backgroundColor", "#f0eee9");
      } else { //enables dark mode
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
          <header className="header" style={{ backgroundColor: headerColor }}>
            <div>
              {/* Website title with dynamic text color */}
              <h1 className="frontPageTitle" style={{ color: wordColor }}>
                Movie Match
              </h1>
            </div>
  
            {/* Header options section */}
            <div
              className="headerOptions"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <span
                style={{
                  marginRight: "1.1718vw",
                  color: "white",
                  fontSize: "2.377vh",
                }}
              >
                {/* Register link with dynamic text color */}
                <Link
                  to="/Register"
                  style={{ color: wordColor, textDecoration: "none" }}
                >
                  Register
                </Link>
              </span>
              <div>
                <span
                  style={{
                    color: "white",
                    fontSize: "2.377vh",
                  }}
                >
                  {/*Link to the login page with dynamic text color */}
                  <Link
                    to="/Login"
                    style={{ color: wordColor, textDecoration: "none" }}
                  >
                    Sign in
                  </Link>
                </span>
              </div>
              <div>
  
                {/* Dark mode toggle button */}
                {darkMode && (
                  <img
                    src={darkSun}
                    alt="light mode"
                    className="dark_mode"
                    onClick={dark_mode}
                  ></img>
                )}
  
                {/* Light mode toggle button */}
                {!darkMode && (
                  <img
                    src={sun}
                    alt="dark mode"
                    className="dark_mode"
                    onClick={dark_mode}
                  ></img>
                )}
  
              </div>
            </div>
          </header>
  
          {/* TODO change this from inline to css */}
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
          <h3>
            {viewportHeight} x {viewportWidth}
          </h3>
        </div>
      </div>
    );
  }