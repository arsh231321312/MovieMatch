
//Import necessary libraries and components
import React, { useState } from "react"; // React library for building UI and useState for state management
import CryptoJS from "crypto-js"; //Cryptographic operations
import { Link, Navigate } from "react-router-dom"; // Navigation components for routing
import "../App.css"; 
import eye_closed from "../pictures/eye_closed.png"; 
import darkSun from "../pictures/sun.png"; 
import sun from "../pictures/sunBright.png"; 
import "../APictures.css"; 
import { setGlobalState, useGlobalState } from "../GlobalVars"; // Global state management functions
import { jwtDecode } from "jwt-decode"; // Library to decode JSON web tokens
import { Box } from "./InputFunctions";
import { isCookie,getCookie,setCookie,removeCookie } from "./Cookie";
import {PasswordInput,UsernameInput} from './InputFunctions'

//Date: 2024-11-15 changed made by: Katherine
//adding bootstrap import
// import 'bootstrap/dist/css/bootstrap.min.css';

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
      let gotSalt=false;
      let hashpass='';
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
      
      const dataSalt={
        username: hashedUser,
        email: emailExists,
        type: "salt",
      };
      //Send Post request to backend
      fetch("http://localhost:5000/3000", {
        method: "POST", //HTTP method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSalt), //Convert data to JSON
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
            setGlobalState("usesEmail", emailExists); //tracks if email already exists
            setGlobalState("account", hashedUser);
            const p=data.salt+password;
            hashpass=CryptoJS.SHA256(p).toString(); //Hash the username
            gotSalt=true;
          }
        })
  
        //toggles password visibilty through the eye icon
        .catch((error) => {
          console.error("Error:", error);
        });



      if (gotSalt === false){
        return;
      }
      //Prepare data for submission to SQL database
      const data = {
        username: hashedUser,
        password: hashpass,
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
            setCookie('authToken', data.token, 15*12); //Set the authentication token in cookies
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
      // setHashedPass(CryptoJS.SHA256(pass).toString());
  
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
      <div className="page" >
        
        {/* Redirect the user to the main page if authentication cookies exist or login succeeds */}
      {isCookie() && <Navigate to="/mainPage" />}
  
        {isCookie() && <Navigate to="/mainPage"/>}
        {gotoMainPage && <Navigate to="/mainPage" />}
        
        <Box>
          <div>
             {/* Title of the page */}
            <h1 style={{ position: "relative", color: backgroundColor, paddingTop: "20px"}}>
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
              padding: "30px",
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