import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";
import "../APictures.css";
import { setGlobalState, useGlobalState } from "../GlobalVars";
import Footer from "./footer/Footer.js";
import TMDB from "../pictures/TMDB.svg";
import Navbar from "./navbar/Navbar.js";

export function FrontPage() {
  const [topMovies, settopMovies] = useState([]);
  const [error, setError] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [backgroundColor] = useGlobalState("backgroundColor");
  const [headerColor] = useGlobalState("headerColor");
  const [darkMode] = useGlobalState("DarkMode");
  const [wordColor] = useGlobalState("wordColor");

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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div>
      <div className="page" style={{ backgroundColor: backgroundColor }}>
        <Navbar />

        <h1
          style={{ color: wordColor }}
          className="gradient"
          id="MovieMatchTitle"
        >
          Welcome to Movie Match
        </h1>
        <h2
          className="gradient MovieMatchParagraph"
          style={{ fontWeight: "500", color: wordColor }}
        >
          Never know what to watch? We've got you
        </h2>
        <h3
          className="gradient MovieMatchParagraph"
          id="secondaryText"
          style={{ color: wordColor }}
        >
          Connect to your LetterBoxd Watchlist
          <br />
          Pull the movies you want to watch
          <br />
          It's a match
        </h3>
        <div
          className="gradient"
          style={{ margin: "0", paddingTop: "0px", paddingBottom: "0px" }}
        >
          <Link
            className="cta-button"
            to="/Register"
            style={{ textDecoration: "none" }}
          >
            Ready? Set. Match!
          </Link>
        </div>
        <div className="gradient">
          <div className="hero">
            <h1
              style={{
                display: "flex",
                justifyContent: "flex-start",
                paddingLeft: "20px",
                paddingTop: "20px",
                fontWeight: "200",
              }}
            >
              Trending Movie Inspiration
            </h1>
            {topMovies.length > 0 ? (
              <div className="movie-container">
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
                  <img src={TMDB} alt="TheMovieDatabase Logo" id="TMDB-Logo" />
                </div>
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
