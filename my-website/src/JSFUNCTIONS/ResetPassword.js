//Import necessary libraries and components
import React, { useState } from "react"; // React library for building UI and useState for state management
import { Link, Navigate } from "react-router-dom"; // Navigation components for routing
import "../App.css";
import "../APictures.css";
import { useGlobalState } from "../GlobalVars"; // Global state management functions
import { Box } from "./InputFunctions";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Navbar } from "./navbar/Navbar";


// Component for Reset Password Form
export function ResetPasswordForm() {
  const auth = getAuth();
  const [backgroundColor] = useGlobalState("backgroundColor");
  // const [wordColor] = useGlobalState("wordColor");
  // const [headerCol] = useGlobalState('headerColor');
  const [userSentReq,setUserSentReq] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');
  const [email,setEmail] = useState('');
  
  const handleSubmit = (e) =>{
    e.preventDefault()
    sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("email sent")
      setUserSentReq(true)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      setUserSentReq(false)
      setErrorMessage(errorMessage)
    });
  }
  const handleChangeEmail = (e) =>{
    setEmail(e.target.value)
  }
  


  //Main component return
  return (
    <div className="page" style={{ backgroundColor: backgroundColor }}>
      {/* Redirect to the login page if the condition is met */}
      {userSentReq && <Navigate to="/Login" />}
      <Navbar/>
      <Box >
        <div> 
          <h1
            style={{
              position: "relative",
              color: backgroundColor,
              paddingTop: "20px",
            }}
          >
            Change Password
          </h1>
        </div>
        <div>
          {/* Form submission handler */}
          <form className="form" onSubmit={handleSubmit} style={{marginTop:'20px'}}>
          <div className="divInputBox">
              <input        
                className="inputBox"
                type="email"
                value={email}
                onChange={handleChangeEmail}
                placeholder="email@gmail.com"
                size="40"
                height="40px"
                maxLength={40}
                minLength={6}
                required
              />
            <br />
            </div>

            {/* Password input component */}
            
            <div className="errorMSG">
              {errorMessage && <span>{errorMessage}</span>}
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
            {/* <div>
              {resetPassFail && (
                <span className="errorMSG">{resetPassFailMSG}</span>
              )}
            </div> */}
          </form>
        </div>
        <div style={{padding:'10px'}}>
          <span style={{ position: "relative", left: "0px" }}>
            <Link
              to="/Login"
              style={{ textDecoration: "none", marginLeft: "5px", color: "blue",fontSize:'14' }}
            >
              Sign in
            </Link>
          </span>
        </div>
      </Box>
    </div>
  );
}
