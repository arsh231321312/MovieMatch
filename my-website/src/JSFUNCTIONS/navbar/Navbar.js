import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import darkSun from "../../pictures/sun.png";
import sun from "../../pictures/sunBright.png";
import menu from "../../pictures/menu.png";
import MovieMatchIcon from "../../pictures/MovieMatchIcon.png";
import "../../App.css";
import "../../APictures.css";
import { setGlobalState, useGlobalState } from "../../GlobalVars";
import Dropdown from "../dropdown/Dropdown";

const Navbar = () => {
  const [darkMode] = useGlobalState("DarkMode");
  const [headerColor] = useGlobalState("headerColor");
  const [wordColor] = useGlobalState("wordColor");
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
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
      {/* Movie Match Icon and title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent:"flex-end"}}>
        <img
          src={MovieMatchIcon}
          alt="Movie Match Icon"
          className="icon"
          style={{ width: "50px", height: "50px", marginRight: "10px" }}
        />
        <h1 className="frontPageTitle" style={{ color: wordColor, margin: 0 }}>
          Movie Match
        </h1>
      </div>

      {/* Adds the breakpoint for the  */}
      {isMobile ? (
        <>
          <div onClick={toggleDropdown} style={{ cursor: "pointer" }}>
            <img src={menu} alt="menu icon" style={{ width: "30px", paddingRight:"0"}} />
          </div>
          {isDropdownOpen && (
            <Dropdown>
              <Link
                to="/Register"
                className="navLinks"
                style={{ color: wordColor, textDecoration: "none" }}
              >
                Register
              </Link>
              <Link
                to="/Login"
                className="navLinks"
                style={{ color: wordColor, textDecoration: "none" }}
              >
                Sign in
              </Link>
            </Dropdown>
          )}
        </>
      ) : (
        <div
          className="headerOptions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
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
          <div className="sun">
            <img
              src={darkMode ? darkSun : sun}
              alt="dark mode toggle"
              className="dark_mode"
              onClick={dark_mode}
              style={{ width: "30px", cursor: "pointer" }}
            />
          </div>
        </div>
        
      )}
    </header>
  );
};

export default Navbar;