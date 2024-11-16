
//Import necessary libraries and components
import React, { useState } from "react"; // React library for building UI and useState for state management
import CryptoJS from "crypto-js"; //Cryptographic operations
import { Link, Navigate } from "react-router-dom"; // Navigation components for routing
import "./App.css"; 
import eye_closed from "./pictures/eye_closed.png"; 
import darkSun from "./pictures/sun.png"; 
import sun from "./pictures/sunBright.png"; 
import "./APictures.css"; 
import { setGlobalState, useGlobalState } from "./GlobalVars"; // Global state management functions
import { jwtDecode } from "jwt-decode"; // Library to decode JSON web tokens


//Date: 2024-11-15 changed made by: Katherine
//adding bootstrap import
import 'bootstrap/dist/css/bootstrap.min.css';


/**
 * Function to set a browser cookie
 * @param {string} name - Name of the cookie
 * @param {string} value - Value to store in the cookie
 * @param {number} maxAge - Expiration time in seconds
 */

export const setCookie = (name, value, maxAge) => {
  document.cookie = `${name}=${value}; Max-Age=${maxAge}; path=/;`;
};

/**
 * Function to check if a valid auth cookie exists
 * @returns {boolean} - True if the auth token exists and is valid
 */
export function isCookie(){
  const token=getCookie('authToken');//Retrieve authentication token from cookies
  if (token === null){ //If the token does not exist
    return false;
  }
  const decodedToken = jwtDecode(token);//Decode the token
  const username = decodedToken.username;//Retrieve the username from the token
  const emailExists = decodedToken.emailExists;
  setGlobalState('usesEmail', emailExists); // Update email status
  setGlobalState('account', username); // Update username
  setGlobalState("authenticated", true); // Set authentication state to true
  return true;
}

/**
 * Function to get a specific cookie by name
 * @param {string} name - Name of the cookie
 * @returns {string|null} - Value of the cookie or null if not found
 */
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Function to remove a cookie
export const removeCookie = (name) => {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
};

/**
 * Sign-up form component for user registration
 */
export function SignUpForm() {
  //Variables to store user input and validation messages
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [PasswordRepeat, setPassRepeat] = useState("");
  const [hashedUser, setHashedUser] = useState("");//Hashed username
  const [hashedPass, setHashedPass] = useState("");//Hashed password
  const [hashedEmail, setHashedEmail] = useState(""); //Hashed email
  const [errorMessageExistsEmail, setErrorMessageExistsEmail] = useState(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessageExistsUser, setErrorMessageExistsUser] = useState(false);
  const [errorMessageUser, setErrorMessageUser] = useState("");
  const [errorMessageExistsPass, setErrorMessageExistsPass] = useState(false);
  const [errorMessagePass, setErrorMessagePass] = useState("");
  const [revealPassword, setRevealPassword] = useState(true);
  const [ErrorPassMismatch, setErrorPassMismatch] = useState(false);
  const [PassMismatchMSG, setPassMismatchMSG] = useState("");//Toggle to show password
  const [gotoMainPage, setGotoMainPage] = useState(false);
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [headerCol] = useGlobalState("headerColor");
  const [loginFail, setLoginFail] = useState(false);
  const [loginFailMSG, setLoginFailMSG] = useState("");
  
  /**
 * Toggle the visibility of the password field
 */
  function eye_change() {
    if (revealPassword) {
      setRevealPassword(false);
    } else {
      setRevealPassword(true);
    }
  }

  /**
   * Handle form submission and validate user inputs
   * @param {Event} e - Form submission event
   */
  function handleSubmit(e) {
    let errorMessageExistsUserScope = false;
    let errorMessageExistsEmailScope = false;
    let passwordMismatchScope = false;
    e.preventDefault(); // Prevent default form submission behavior
    

    // Validate username length is greater than 6 characters
    if (username.length < 6) {
      setErrorMessageUser("Username must be at least 6 characters long");
      setErrorMessageExistsUser(true);
      errorMessageExistsUserScope = true;
    } else {
      setErrorMessageExistsUser(false);
    }

    // Validate email format
    if (email.length < 6) { //email is less than 6 characters
      setErrorMessageEmail("Email must be at least 6 characters long");
      setErrorMessageExistsEmail(true);
      errorMessageExistsEmailScope = true;
    } else if (email.includes("@") === false) {//checks if @ sign is present
      setErrorMessageEmail("Email must contain an '@' symbol");
      setErrorMessageExistsEmail(true);
      errorMessageExistsEmailScope = true;
    } else {
      setErrorMessageExistsEmail(false);
    }


    //Checks if password are identical
    if (password === PasswordRepeat) { //if passwords match
      setErrorPassMismatch(false);
    } else {
      setPassMismatchMSG("Passwords do not match");//if passwords do not match
      setErrorPassMismatch(true);
      passwordMismatchScope = true;
    }

    //If any validation errors exist, return
    if (
      errorMessageExistsUserScope ||
      errorMessageExistsEmailScope ||
      passwordMismatchScope
    ) {
      return;
    }
    
    //Prepare data for SQL Database
    const data = {
      username: hashedUser,
      password: hashedPass,
      email: hashedEmail,
      type: "register",
    };

    // Make API call to backend
    fetch("http://localhost:5000/3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",//Set content type to JSON
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())//Parse response to JSON
      .then((data) => {//Handle response data
        if (data.status === "failure") {//If the response is a failure
          setGotoMainPage(false);
          setLoginFail(true);
          setLoginFailMSG(data.message);
        } else {//If the response is a success hashes user and moves them to the main page
          setGlobalState("authenticated", true);
          setGlobalState("account", hashedUser);
          setLoginFail(false);
          setGotoMainPage(true);
          setCookie('authToken', data.token, 15);
        }
      })
      .catch((error) => {//Catch any errors
        console.error("Error:", error);
      });
  }
  

  // Function to handle changes in the username input field
  function handleChangeUser(e) {
    const user = e.target.value;//Grabs input value
    setUser(user); //Sets the user state to the input value
    setHashedUser(CryptoJS.SHA256(user).toString());//Hashes the username w/ SHA256
  }

  // Check if the email contains "@" and update the error message state
  function handleChangeEmail(e) {
    const email = e.target.value;
    setEmail(email);
    setHashedEmail(CryptoJS.SHA256(email).toString());
    if (email.includes("@") === true) { //If the email contains an @ symbol
      setErrorMessageExistsEmail(false);
    }
  }

  // Function to handle invalid form submissions
  function handleChangePass(e) {
    const pass = e.target.value; //Get the input value
    setPass(pass); //Set the password state to the input value
    setHashedPass(CryptoJS.SHA256(pass).toString()); //Hash the password
    
    //Validate the password lenght
    if (pass.length < 8) {
      setErrorMessagePass("Password must be at least 8 characters long");
      setErrorMessageExistsPass(true);
    } 
    
    //Validate the password format
    else if (pass.search(/(?=.*\W)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).*/) < 0) {
      setErrorMessagePass(
        "Password must contain at least one number, one uppercase letter, and one special character"
      );
      setErrorMessageExistsPass(true);//has error
    } else {
      setErrorMessageExistsPass(false);//no error
    }

    //Checks if password are identical
    // if (password === PasswordRepeat) {
    //   setErrorPassMismatch(false);
    // }else {
    //   setPassMismatchMSG("Passwords do not match");
    //   setErrorPassMismatch(true);

    // }
  }
  function handleChangePassRepeat(e) {
    const pass = e.target.value;
    setPassRepeat(pass);
    setHashedPass(CryptoJS.SHA256(pass).toString());
    // if (password === PasswordRepeat) {
    //   setErrorPassMismatch(false);
    // }else {
    //   setPassMismatchMSG("Passwords do not match");
    //   setErrorPassMismatch(true);

    // }
  }


  // Function to handle invalid input and prevent form submission
  function handleInvalid(event) {
    event.preventDefault(); // Prevent the form from submitting
  }


  // Main component return
  return (
    <div className="page" style={{ backgroundColor: backgroundColor }}>
      
      {/* Navigate to main page if the condition is met */}
      {gotoMainPage && <Navigate to="/mainPage" />}
      
      <Box>
        <div>
          <h1 style={{ position: "relative", color: headerCol }}> Register</h1>
        </div>
        <div>
          <form className="form" onSubmit={handleSubmit}>
            
            {/* Username input component */}
            <UsernameInput
              username={username}
              handleChangeUser={handleChangeUser}
              handleInvalid={handleInvalid}
            />

            {/* Display error message for username */}
            <div className="errorMSG">
              {errorMessageExistsUser && <span>{errorMessageUser}</span>}
            </div>

            {/* Password input component */}
            <PasswordInput
              password={password}
              handleChangePass={handleChangePass}
              handleInvalid={handleInvalid}
              eye_change={eye_change}
              revealPassword={revealPassword}
            />

            {/* Display error message for password */}
            <div className="errorMSG">
              {errorMessageExistsPass && <span>{errorMessagePass}</span>}
            </div>

            {/* Repeated password input component */}
            <PasswordInput
              password={PasswordRepeat}
              handleChangePass={handleChangePassRepeat}
              handleInvalid={handleInvalid}
              eye_change={eye_change}
              revealPassword={revealPassword}
            />

            {/* Display error message for password mismatch */}
            <div className="errorMSG">
              {ErrorPassMismatch && <span>{PassMismatchMSG}</span>}
            </div>

            {/* Email input component */}
            <EmailInput
              email={email}
              handleChangeEmail={handleChangeEmail}
              handleSubmit={handleSubmit}
            />

            {/* Display error message for password mismatch */}
            <div className="errorMSG">
              {errorMessageExistsEmail && <span>{errorMessageEmail}</span>}
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                className="submitButton"
                style={{ backgroundColor: backgroundColor }}
              >
                Submit
              </button>
            </div>
            <br />

            {/* Display error message if login fails */}
            {loginFail && <span className="errorMSG">{loginFailMSG}</span>}
          </form>
        </div>
        <br />

        {/* Section for users who already have an account */}
        <div className="divExistingACC">
          <span style={{ color: backgroundColor }}>Have an account?</span>
          <span>
            <Link
              to="/Login"
              style={{
                textDecoration: "none",
                marginLeft: "5px",
                color: "blue",
              }}
            >
              Sign in
            </Link>
          </span>
        </div>
      </Box>
    </div>
  );
}


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

        {/*Centered message below the header */}
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

        {/* Display viewport dimensions */}
        <h3>
          {viewportHeight} x {viewportWidth}
        </h3>
      </div>
    </div>
  );
}

// Sign-in form component
export function SignInForm() {
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [wordColor] = useGlobalState("wordColor");
  const [password, setPassword] = useState("");
  const [hashedPass, setHashedPass] = useState("");
  const [username, setUsername] = useState("");
  const [hashedUser, setHashedUser] = useState("");
  const [errorMessageExistsUser, setErrorMessageExistsUser] = useState(false);
  const [errorMessageUser, setErrorMessageUser] = useState("");
  const [errorMessageExistsPass, setErrorMessageExistsPass] = useState(false);
  const [errorMessagePass, setErrorMessagePass] = useState("");
  const [revealPassword, setRevealPassword] = useState(true);
  const [emailExists, setEmailExists] = useState(false);
  const [loginFail, setLoginFail] = useState(false);
  const [loginFailMSG, setLoginFailMSG] = useState("");
  const [gotoMainPage, setGotoMainPage] = useState(false);
  
  
  function handleSubmit(e) {
    e.preventDefault(); //prevent default form submission behavior

    //checks if the username is at least 6 characters long
    if (username.length < 6) {
      setErrorMessageUser("Username must be at least 6 characters long");
      setErrorMessageExistsUser(true);
    } else {
      setErrorMessageExistsUser(false);
    }
    if (errorMessageExistsUser) {//Stop if username validation fails
      return;
    }

    //Prepare data for submission to SQL database
    const data = {
      username: hashedUser,
      password: hashedPass,
      email: emailExists,
      type: "signin",
    };

    //Send Post request to backend
    fetch("http://localhost:5000/3000", {
      method: "POST", //HTTP method
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), //Convert data to JSON
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "failure") {
          //If the response is a failure, display the error message
          setGotoMainPage(false);
          setLoginFailMSG(data.message);
          setLoginFail(true);
        } else {
          //login success
          setGlobalState("authenticated", true);
          setGlobalState("usesEmail", emailExists); //tracks if email already exists
          setGlobalState("account", hashedUser);
          setCookie('authToken', data.token, 15); //Set the authentication token in cookies
          setLoginFail(false);
          setGotoMainPage(true); //Redirect to the main page
          
        }
      })

      //toggles password visibilty through the eye icon
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  function eye_change() {
    if (revealPassword) {
      setRevealPassword(false);
    } else {
      setRevealPassword(true);
    }
  }

  //Function to handle changes in the username input field
  function handleChangeUser(e) {
    const user = e.target.value;
    setUsername(user); //Update the username state
    setHashedUser(CryptoJS.SHA256(user).toString()); //Hash the username
    
    //checks username length
    if (username.length < 6) {
      setErrorMessageUser("Username must be at least 6 characters long");
      setErrorMessageExistsUser(true);
    } else {
      setErrorMessageExistsUser(false);
    }
    if (username.includes("@") === true) {//checks if the username contains an @ symbol
      setEmailExists(true); //If it does, set emailExists to true
    } else { //If it does not, set emailExists to false
      setEmailExists(false);
    }
  }
  function handleInvalid(event) {
    event.preventDefault(); // Prevent the form from submitting
  }

  //Function to handle changes in the password input field
  function handleChangePass(e) {
    const pass = e.target.value;
    setPassword(pass);
    setHashedPass(CryptoJS.SHA256(pass).toString());

    //checks password length
    if (pass.length < 8) {
      setErrorMessagePass("Password must be at least 8 characters long");
      setErrorMessageExistsPass(true);
    } else if (pass.search(/(?=.*\W)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).*/) < 0) {
      setErrorMessagePass(
        "Password must contain at least one number, one uppercase letter, and one special character"
      );
      setErrorMessageExistsPass(true);
    } else {
      setErrorMessageExistsPass(false);
    }
  }

  //Render the sign-in form 
  return (
    <div className="page" style={{ backgroundColor: backgroundColor }}>
      
      {/* Redirect the user to the main page if authentication cookies exist or login succeeds */}
    {isCookie() && <Navigate to="/mainPage" />}

      {isCookie() && <Navigate to="/mainPage"/>}
      {gotoMainPage && <Navigate to="/mainPage" />}
      
      <Box>
        <div>
           {/* Title of the page */}
          <h1 style={{ position: "relative", color: backgroundColor }}>
            {" "}
            Sign In
          </h1>


        </div>
        {/* Form submission handler */}
        <form className="form" onSubmit={handleSubmit}>

          {/* Username input component */}
          <UsernameInput
            username={username}
            handleChangeUser={handleChangeUser}
            handleInvalid={handleInvalid}
          />

          <div className="errorMSG">
            {/* Display username error messages if validation fails */}
            {errorMessageExistsUser && <span>{errorMessageUser}</span>}
          </div>

          {/* Password input component */}
          <PasswordInput
            password={password}
            handleChangePass={handleChangePass}
            handleInvalid={handleInvalid}
            eye_change={eye_change}
            revealPassword={revealPassword}
          />
          <div className="errorMSG">
            {errorMessageExistsPass && <span>{errorMessagePass}</span>}
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="submitButton"
              style={{ backgroundColor: backgroundColor, color: wordColor }}
            >
              Submit
            </button>
          </div>

          {/* Display error message if login fails */}
          <div
            style={{
              width: "303px",
              textAlign: "center",
              position: "relative",
              left: "10%",
            }}
          >
            <br />
            {loginFail && (
              <span
                className="errorMSG"
                style={{ width: "auto", minWidth: "303px" }}
              >
                {loginFailMSG}
              </span>
            )}
          </div>
        </form>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <span style={{ position: "relative" }}>
            <Link
              to="/resetPassword"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Forgot Password?
            </Link>
          </span>

          <span style={{ position: "relative" }}>
            <Link
              to="/Register"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Register
            </Link>
          </span>
        </div>
      </Box>
    </div>
  );
}


// Component for the main page
const Box = ({ children, width, height, backgroundColor }) => {
  return (
    <div className="box" style={{ width, height, backgroundColor }}>
      {children}
    </div>
  );
};


// Component for Reset Password Form
export function ResetPasswordForm() {
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [headerCol] = useGlobalState("headerColor");

  const [username, setUsername] = useState("");
  const [hashedUser, setHashedUser] = useState("");
  const [errorMessageExistsUser, setErrorMessageExistsUser] = useState(false);
  const [errorMessageUser, setErrorMessageUser] = useState("");

  const [errorPassMismatch, setErrorPassMismatch] = useState(false);
  const [PassMismatchMSG, setPassMismatchMSG] = useState("");
  const [password, setPassword] = useState("");
  const [hashedPass, setHashedPass] = useState("");
  const [PasswordRepeat, setPassRepeat] = useState("");
  const [revealPassword, setRevealPassword] = useState(true);
  const [errorMessageExistsPass, setErrorMessageExistsPass] = useState(false);
  const [errorMessagePass, setErrorMessagePass] = useState("");
  const [resetPassFail, setResetPassFail] = useState(false);
  const [resetPassFailMSG, setResetPassFailMSG] = useState("");

  const [gotoLoginPage, setGotoLoginPage] = useState(false);

  //Function to toggle password visibility
  function eye_change() {
    if (revealPassword) {
      setRevealPassword(false);
    } else {
      setRevealPassword(true);
    }
  }

  //Function to handle form submission
  function handleSubmit(e) {
    let errorMessageExistsUserScope = false;
    let passwordMismatchScope = false;
    let emailExists = false;
    e.preventDefault();

    //Validate username length
    if (username.length < 6) {
      setErrorMessageUser("Username must be at least 6 characters long");
      setErrorMessageExistsUser(true);
      errorMessageExistsUserScope = true;
    } else { //If the username is valid, set the error message to false
      setErrorMessageExistsUser(false);
      errorMessageExistsUserScope = false;
    }
    if (username.includes("@") === true) { //If the username contains an @ symbol
      emailExists = true;
    } else {
      emailExists = false;
    }

    //Checks if passwords are identical
    if (password === PasswordRepeat) {
      setErrorPassMismatch(false);
    } else { //If the passwords do not match, set the error message
      setPassMismatchMSG("Passwords do not match");
      setErrorPassMismatch(true);
      passwordMismatchScope = true;
    }
    if (errorMessageExistsUserScope || passwordMismatchScope) {
      return;
    }

    //Prepare data for submission to SQL database
    const data = {
      username: hashedUser,
      password: hashedPass,
      email: emailExists,
      type: "changePassword",
    };

    //Send Post request to backend
    fetch("http://localhost:5000/3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", //Set content type to JSON
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json()) // Parse response to JSON
      .then((data) => {
        if (data.status === "failure") { //If the response is a failure, display the error message
          setResetPassFail(true);
          setResetPassFailMSG(data.message);
        } else {
          setGotoLoginPage(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  //Function to handle changes in the username input field
  function handleChangeUser(e) {
    const user = e.target.value;
    setUsername(user);
    setHashedUser(CryptoJS.SHA256(user).toString()); // Hash the username
    
    //Validate the username length
    if (username.length < 6) { // If the username is less than 6 characters, set the error message
      setErrorMessageUser("Username must be at least 6 characters long");
      setErrorMessageExistsUser(true);
    } else { //If the username is valid, set the error message to false
      setErrorMessageExistsUser(false);
    }
  }

  function handleInvalid(e) { //Function to handle invalid form submissions
    e.preventDefault();
  }

  //Function to handle changes in the password input field
  function handleChangePass(e) {
    const pass = e.target.value;
    setPassword(pass);
    setHashedPass(CryptoJS.SHA256(pass).toString());

    //Validate the password length
    if (pass.length < 8) {
      setErrorMessagePass("Password must be at least 8 characters long");
      setErrorMessageExistsPass(true);
    } else if (pass.search(/(?=.*\W)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).*/) < 0) {
      setErrorMessagePass(
        "Password must contain at least one number, one uppercase letter, and one special character"
      );
      setErrorMessageExistsPass(true);
    } else {
      setErrorMessageExistsPass(false);
    }
  }

  //Function to handle changes in the repeated password input field
  function handleChangePassRepeat(e) {
    const pass = e.target.value;
    setPassRepeat(pass);
    setHashedPass(CryptoJS.SHA256(pass).toString());

    //Checks if the passwords are identical
    if (password === PasswordRepeat) {
      setErrorPassMismatch(false);
    } else {
      setPassMismatchMSG("Passwords do not match");
      setErrorPassMismatch(true);
    }
  }

  //Main component return
  return (
    <div className="page" style={{ backgroundColor: backgroundColor }}>

      {/* Redirect to the login page if the condition is met */}
      {gotoLoginPage && <Navigate to="/Login" />}
      <Box>
        <div>
          <h1 style={{ position: "relative", color: headerCol }}>
            Change Password
          </h1>
        </div>

        {/* Form submission handler */}
        <form className="form" onSubmit={handleSubmit}>
          <UsernameInput
            username={username}
            handleChangeUser={handleChangeUser}
            handleInvalid={handleInvalid}
          />
          {/* Display error message for username */}
          <div className="errorMSG">
            {errorMessageExistsUser && <span>{errorMessageUser}</span>}
          </div>

          {/* Password input component */}
          <PasswordInput
            password={password}
            handleChangePass={handleChangePass}
            handleInvalid={handleInvalid}
            eye_change={eye_change}
            revealPassword={revealPassword}
          />

          {/* Display error message for password */}
          <div className="errorMSG">
            {errorMessageExistsPass && <span>{errorMessagePass}</span>}
          </div>

          {/* Repeated password input component */}
          <PasswordInput
            password={PasswordRepeat}
            handleChangePass={handleChangePassRepeat}
            handleInvalid={handleInvalid}
            eye_change={eye_change}
            revealPassword={revealPassword}
          />
          <div className="errorMSG">
            {errorPassMismatch && <span>{PassMismatchMSG}</span>}
          </div>
          <div>
            {/* Submit button */}
            <button
              type="submit"
              className="submitButton"
              style={{ backgroundColor: backgroundColor }}
            >
              Submit
            </button>
          </div>

          {/* Display error message if password reset fails */}
          <div>
            {resetPassFail && (
              <span className="errorMSG">{resetPassFailMSG}</span>
            )}
          </div>
        </form>
        <span style={{ position: "relative", left: "0px" }}>
          <Link
            to="/Login"
            style={{ textDecoration: "none", marginLeft: "5px", color: "blue" }}
          >
            Sign in
          </Link>
        </span>
      </Box>
    </div>
  );
}

// Component for the main page
function UsernameInput({ username, handleChangeUser, handleInvalid }) {
  //Function to handle changes in the username input field
  return (
    <div className="divInputBox">
      <input
        className="inputBox"
        type="username"
        value={username}
        size="40"
        height="40px"
        maxLength={40}
        minLength={6}
        placeholder="Username"
        onInput={handleChangeUser}
        onInvalid={handleInvalid}
        required
      />
      <br />
    </div>
  );
}

// Component for the password input field
function PasswordInput({
  password,
  handleChangePass,
  handleInvalid,
  eye_change,
  revealPassword,
}) {
  return (
    //Function to handle changes in the password input field
    <div className="divInputBox" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
      <input
        type={revealPassword && "password"}
        className="inputBox"
        value={password}
        size="40"
        height="40px"
        pattern="(?=.*\W)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).*"
        maxLength={40}
        minLength={8}
        placeholder={"Password123!"} 
        onInput={handleChangePass}
        onInvalid={handleInvalid}
        required
      />

      {/* Password visibility toggle */}
      {revealPassword && (
        <img
          src={eye_closed}
          alt="password_eye_open"
          className="password_eye"
          onClick={eye_change}
          style={{position:'absolute'}}
        ></img>
      )}


      {/* Password visibility toggle */}
      {!revealPassword && (
        <img
          src={
            "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-eye-512.png"
          }
          alt="password_eye_closed"
          className="password_eye"
          onClick={eye_change}
          style={{position:'absolute'}}
        ></img>
      )}
    </div>
  );
}

// Component for the email input field
function EmailInput({ email, handleChangeEmail, handleSubmit }) {
  return (
    <div className="divInputBox">
      <input
        className="inputBox"
        type="email"
        value={email}
        size="40"
        height="40px"
        placeholder={"Example@gmail.com"}
        onInput={handleChangeEmail}
        maxLength={40}
        minLength={6}
        title="Must contain at least one number and one uppercase letter"
        onInvalid={handleSubmit}
        required
      />
    </div>
  );
}


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
  const [acc] = useGlobalState("account");
  const [em] = useGlobalState("usesEmail");
  const [result, setResult] = useState([]);
  
  // Function to display previous movie suggestions
  function MovieList({ result, wordColor }) {
    const [emailExists] = useGlobalState('usesEmail')
    const [acc] = useGlobalState('account')
    function BringMovie(movieID) {
      const data = {
        account: acc,
        emailExists: emailExists,
        type: "LoadPrevMovie",
        movieID:movieID
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
            alert(movieID)
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  
    // Function to display previous movie suggestions
    return (
      <div>
        {result.map((item, index) => (
          <h1
            key={index}
            style={{
              color: wordColor,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              border: "10px solid black",
            }}
            onClick={() => BringMovie(item[2])}
          >
            {item[0] && (
              <img
                src={item[0]}
                alt="prevMoviePoster"
                style={{ height: "200px", width: "200px" }}
              />
            )}
            {item[1] && <p style={{ fontSize: "16px" }}>{item[1]}</p>}
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
      account: acc,
      emailExists: em,
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
        if (data.status === "failure") { // If the response is a failure, display the error message
          alert(data.message);
        } else { // If the response is a success, display the movie data
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
          <div>
            <h1 style={{ color: wordColor, width: "75vw" }}>
              LetterBoxd WatchList
            </h1>
          </div>
        </header>
        <div>
          
          {/* Display previous movie suggestions */}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: showUserData ? 'translate(-12.5vw,0)' : 'translate(0,0)',
            width: "100%",
          }}
        >
          {/* Display previous movie suggestions */}
          {showUserData && (
            <div style={{ marginLeft: "3vw" }}>
              <button
                style={{
                  position:'absolute', //hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
                  alignItems: "center",
                  width: "30vw",
                  justifyContent: "flex-start",
                  left:'15vw',
                  transform: 'translate(0,-50%)'
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
              <div
                style={{
                  height: "100%",
                  overflowY: "auto", // Change overflow to overflowY
                  wordWrap: "break-word",
                  backgroundColor: "grey",
                  marginLeft: '3vw'
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
              display: isMobile ? 'flex' : undefined,
              flexDirection: isMobile ? 'column' : undefined
            }}
          >
            {/* Second div that takes up the remaining space */}
            <div
              style={{ width: "100%", maxWidth: "100%", textAlign: "center" }}
            >
              {/* Display the movie data */}
              {showUserData && (
                <div style={{ overflowY: "auto", justifyContent:'center',alignItems:'center',width:'100vw' }}>
                  <div
                    style={{
                      display: isMobile ? undefined: "flex",
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
                    <div style={{ width: isMobile ? "90vw" : "600px",paddingLeft:'5vw' }}>
                      <h1 style={{ color: wordColor,maxWidth:'100vw' }}>{dataset["title"]}</h1>
                      <p style={{ color: wordColor,maxWidth:'100vw' }}>{dataset["tagline"]}</p>
                      <p style={{ color: wordColor , maxWidth:'100vw'}}>{dataset["description"]}</p>
                      <ExternalLink url={dataset["whereToWatch"]} />
                    </div>
                  </div>
                  <VideoPlayer src={dataset["trailer"]} />
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
  style={{ border: "none" }}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
  return (
    <div className="video-container pt-5">
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


