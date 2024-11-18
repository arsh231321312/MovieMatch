
//Import necessary libraries and components
import React, { useState } from "react"; // React library for building UI and useState for state management
import CryptoJS from "crypto-js"; //Cryptographic operations
import { Link, Navigate } from "react-router-dom"; // Navigation components for routing
import "../App.css"; 
import "../APictures.css"; 
import { setGlobalState, useGlobalState } from "../GlobalVars"; // Global state management functions
import { Box } from "./InputFunctions";
import {setCookie } from "./Cookie";
import {PasswordInput,UsernameInput,EmailInput,} from './InputFunctions'




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