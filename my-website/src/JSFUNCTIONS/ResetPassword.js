//Import necessary libraries and components
import React, { useState } from "react"; // React library for building UI and useState for state management
import CryptoJS from "crypto-js"; //Cryptographic operations
import { Link, Navigate } from "react-router-dom"; // Navigation components for routing
import "../App.css"; 
import "../APictures.css"; 
import { useGlobalState } from "../GlobalVars"; // Global state management functions
import { Box } from "./InputFunctions";
import {PasswordInput,UsernameInput} from './InputFunctions'


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