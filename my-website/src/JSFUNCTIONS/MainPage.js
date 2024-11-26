//Import necessary libraries and components
import React, { useState } from "react"; // React library for building UI and useState for state management
import "../App.css";
import "../APictures.css";
import eye_closed from "../pictures/eye_closed.png"
import { useGlobalState } from "../GlobalVars"; // Global state management functions
// import "bootstrap/dist/css/bootstrap.min.css"; //Adding bootstrap import


// Component for the main page
export function MainPage() {
  const isMobile = window.innerWidth <= 600;
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [headerCol] = useGlobalState("headerColor");
  // const [darkMode] = useGlobalState('DarkMode');
  const [wordColor] = useGlobalState("wordColor");
  const [divSearchBarClass, setDivSearchBarClass] = useState("searchBox");
  const [searchBarClass, setSearchBarClass] = useState("searchBar");
  const [LetterUser, setLetterUser] = useState("");
  const [showUserData, setShowUserData] = useState(false);
  const [dataset, setDataset] = useState([]);
  const [previousMoviesButton, setPreviousMoviesButton] = useState(false);
  // const [acc] = useGlobalState("account");
  // const [em] = useGlobalState("usesEmail");
  const [result, setResult] = useState([]);

  // Function to display previous movie suggestions
  function MovieList({ result, wordColor }) {
    const [emailExists] = useGlobalState("usesEmail");
    const [acc] = useGlobalState("account");
    function BringMovie(movieID) {
      const data = {
        account: acc,
        emailExists: emailExists,
        type: "LoadPrevMovie",
        movieID: movieID,
      };
      fetch("http://localhost:5000/3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "failure") {
            alert(movieID);
          } else {
            setDataset(data.data)
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    // Function to display previous movie suggestions
    return (
      <div className="prevMoviesContainer">
        {result.map((item, index) => (
          <h1
            key={index}
            style={{
              color: wordColor,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              border: "none",
            }}
            onClick={() => BringMovie(item[2])}
          >
            {item[0] && (
              <img
                src={item[0]}
                alt="prevMoviePoster"
                className="prevMoviePoster"
                style={{ height: "200px", maxWidth: "200px" }}
              />
            )}
            {item[1] && <p class="prevMovieText" style={{ fontSize: "15px" }}>{item[1]}</p>}
          </h1>
        ))}
      </div>
    );
  }

  // Function to handle the search bar submission
  function handleSubmit(e) {
    e.preventDefault();

    const data = {
      username: LetterUser,
      type: "LetterUser",
    };

    // Send Post request to backend
    fetch("http://localhost:5000/3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      // Parse response to JSON
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "failure") {
          // If the response is a failure, display the error message
          alert(data.message);
        } else {
          // If the response is a success, display the movie data
          setDivSearchBarClass("changeSeachBox");
          setSearchBarClass("changeSearchBar");
          setDataset(data.data);
          setShowUserData(true);
          setResult(data.result);
        }
      })

      // Catch any errors
      .catch((error) => {
        console.error("Error:", error);
      });

    setLetterUser("");
  }

  // Function to display previous movie suggestions
  function showPrevMovies() {
    setPreviousMoviesButton(!previousMoviesButton);
  }

  return (
    <div>
      <div className="page" style={{ backgroundColor: backgroundColor }}>
        <header
          className="header"
          style={{
            backgroundColor: headerCol,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{display:'flex',flexDirection:'row'}}>
            <h1 className="LetterBoxdTitle" style={{ color: wordColor, width: "75vw" }}>
              LetterBoxd WatchList
            </h1>
            
            <img src={eye_closed} alt="logout"></img>
          </div>
        </header>
        <div>{/* Display previous movie suggestions */}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: showUserData ? "translate(-12.5vw,0)" : "translate(0,0)",
            width: "100%",
          }}
        >
          {/* Display previous movie suggestions */}
          {showUserData && (
            <div style={{ marginLeft: "3vw" }}>
              <button className="prevMoviesButton"
                style={{
                  position: "absolute", //hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
                  alignItems: "center",
                  width: "20vw",
                  justifyContent: "flex-start",
                  left: "15vw",
                  transform: "translate(0,-50%)",
                }}
                onClick={showPrevMovies}
              >
                My Previous Suggestions
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div className={divSearchBarClass}>
              <input
                value={LetterUser}
                className={searchBarClass}
                size="60"
                height="6.339vh"
                maxLength={30}
                minLength={6}
                placeholder="Enter LetterBoxed Username"
                onChange={(e) => setLetterUser(e.target.value)}
                required
              />
            </div>
          </form>
        </div>

        <div style={{ display: "flex", height: "100%" }}>
          {previousMoviesButton && (
            <div
              style={{
                padding: "5px",
                position: "absolute",
                height: "80vh",
                maxHeight: "100vh",
                overflowY: "auto",
              }}
              className="hide-scrollbar"
            >
              {/* First div with fixed width of 50px */}
              {/* This is the previous movie container */}
              <div
                style={{
                  height: "100%",
                  width: "auto",
                  overflowY: "auto", // Change overflow to overflowY
                  wordWrap: "break-word",
                  backgroundColor: "#2F3E46",
                  borderRadius: "10px",
                }}
                className="hide-scrollbar"
              >
                {/* previous movies selected from user */}

                <MovieList result={result} wordColor={wordColor}></MovieList>
              </div>
            </div>
          )}
          <div
            style={{
              display: isMobile ? "flex" : undefined,
              flexDirection: isMobile ? "column" : undefined,
            }}
          >
            {/* Second div that takes up the remaining space */}
            <div
              style={{ width: "100%", maxWidth: "100%", textAlign: "center" }}
            >
              {/* Display the movie data */}
              {showUserData && (
                <div
                  style={{
                    overflowY: "auto",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100vw",
                  }}
                >
                  <div
                    style={{
                      display: isMobile ? undefined : "flex",
                      alignItems: isMobile ? undefined : "center",
                      justifyContent: "center",
                    }}
                  >
                    {dataset["posterImg"] && (
                      <img
                        className="poster"
                        src={dataset["posterImg"]}
                        alt="Poster"
                      />
                    )}
                    <div
                      style={{
                        width: isMobile ? "90vw" : "600px",
                        paddingLeft: "5vw",
                      }}
                    >
                      <h1 style={{ color: wordColor, maxWidth: "100vw" }}>
                        {dataset["title"]}
                      </h1>
                      <p style={{ color: wordColor, maxWidth: "100vw" }}>
                        {dataset["tagline"]}
                      </p>
                      <p style={{ color: wordColor, maxWidth: "100vw" }}>
                        {dataset["description"]}
                      </p>
                      <ExternalLink url={dataset["whereToWatch"]} />
                    </div>
                  </div>
                  <VideoPlayer  src={dataset["trailer"]} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for the video player
function VideoPlayer({ src }) {
  const isMobile = window.innerWidth <= 600;
  const iframeWidth = isMobile ? "340px" : "560px";
  const iframeHeight = isMobile ? "240px" : "315px";
  <iframe

    width={iframeWidth}
    height={iframeHeight}
    src={src}
    title="Trailer"
    flexDirection="column"
    style={{ border: "none" }}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>;
  return (
    <div className="video-container">
      <iframe
        width={iframeWidth}
        height={iframeHeight}
        src={src}
        title="Trailer"
        style={{ border: "none" }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

// Component for the external link
function ExternalLink({ url }) {
  return (
    <div>
      <h1 style={{ color: "white" }}>Where To Watch</h1>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "white" }}
      >
        Visit External Site
      </a>
    </div>
  );
}
