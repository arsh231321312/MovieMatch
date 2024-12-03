import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";
import darkSun from "../pictures/sun.png";
import sun from "../pictures/sunBright.png";
import MovieMatchIcon from "../pictures/MovieMatchIcon.png";
import "../APictures.css";
import { setGlobalState, useGlobalState } from "../GlobalVars";
import Footer from './footer/Footer.js';
import TMDB from "../pictures/TMDB.svg";

export function FrontPage() {
  // States for top movies, error, and theme
  const [topMovies, settopMovies] = useState([]);
  const [error, setError] = useState(null);

  const [backgroundColor] = useGlobalState("backgroundColor");
  const [headerColor] = useGlobalState("headerColor");
  const [darkMode] = useGlobalState("DarkMode");
  const [wordColor] = useGlobalState("wordColor");

  // Fetch top 10 movies on component mount
  useEffect(() => {
    const fetchtopMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?sort_by=box_office.desc&api_key=6194e2db8d14ff0288367b1f19511d83`
        );
        settopMovies(response.data.results.slice(0, 5)); // Get the top 5 movies
      } catch (err) {
        setError("Failed to fetch top movies.");
        console.error(err);
      }
    };

    fetchtopMovies();
  }, []);

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
            <div className="sun">
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

        {/* Hero Section */}
        <h1 className="gradient" id="MovieMatchTitle">Welcome to Movie Match</h1>
        <h2 className="gradient MovieMatchParagraph" style={{ fontWeight: "500" }}>Never know what to watch? We've got you</h2>
        <h3 className="gradient MovieMatchParagraph" id="secondaryText">Connect to your LetterBoxd Watchlist<br />Pull the movies you want to watch<br />It's a match</h3>
        <div className="gradient" style={{ margin: "0", paddingTop: "0px", paddingBottom: "0px" }}>
          <Link className="cta-button"
            to="/Register"
            style={{ textDecoration: "none" }}
          >
            Ready? Set. Match!
          </Link>
        </div>
        <div className="gradient">
          <div className="hero">
            <h1 style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "20px", paddingTop: "20px", fontWeight: "200" }}>Trending Movie Inspiration</h1>
            {topMovies.length > 0 ? (
              <div className="movies-grid">
                {topMovies.map((movie) => (
                  <div className="movie-card" key={movie.id}>
                    <h3 className="MovieMatchParagraph">{movie.title}</h3>
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="movie-poster"
                      />
                    ) : (
                      <p style={{ color: "white" }}>Poster not available</p>
                    )}
                  </div>
                ))}
                <img src={TMDB} alt="TheMovieDatabase Logo" id="TMDB-Logo"/>
              </div>
            ) : (
              <p style={{ color: "white" }}>Loading top movies...</p>
            )}
            
          </div>
        </div>
      </div>
      <div>
       <Footer />
      </div>
    </div>
  );
}