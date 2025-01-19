//Import necessary libraries and components
import React, { useState } from "react"; // React library for building UI and useState for state management
import { Link, Navigate } from "react-router-dom"; // Navigation components for routing
import "../App.css";
import "../APictures.css";
import { useGlobalState } from "../GlobalVars"; // Global state management functions
import { Box } from "./InputFunctions";
import { useAuth } from "../contexts/authContext/index.jsx";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import eyeClosed from '../pictures/eye_closed.png';
import {Navbar} from "./navbar/Navbar.js";
export function SignInForm() {
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [wordColor] = useGlobalState("wordColor");
  const [headerCol]= useGlobalState('headerColor')
  const {userLoggedIn} = useAuth();

  const [email,setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [isSigningIn,setIsSigningIn] = useState(false);
  const [errorMessage,setErrorMessage] = useState('')
  const [type,setType] = useState('password');
  const [eyeImg,setEyeImg] = useState(eyeClosed);
  const revealPassword =()=>{
    if (type==='password'){
      setType('text')
      setEyeImg("https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-eye-512.png")
    }else{
      setType('password')
      setEyeImg(eyeClosed)

    }
  }
  
  const handleSubmit = async (e)=>{

    e.preventDefault();
    setIsSigningIn(false);
    if (!isSigningIn){
      setIsSigningIn(true);
      try{
      await doSignInWithEmailAndPassword(email,password);
      }catch(err){
        if((err.code) === 'auth/invalid-credential'){
          setErrorMessage("Wrong Username and or password")
          setIsSigningIn(false);
        }
      }
    }
  };
  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn){
      setIsSigningIn(true);
      doSignInWithGoogle().catch(err => {
        setIsSigningIn(false);
      })
    }
  }
  const handleChangeEmail = (e) =>{
    setEmail(e.target.value);
  }
  const handleChangePass = (e) =>{
    setPassword(e.target.value);
  }
  return (
    <div className="page" style={{ backgroundColor: backgroundColor }}>
      {/* Redirect the user to the main page if authentication cookies exist or login succeeds */}
      
      {userLoggedIn && <Navigate to="/mainPage" />}
      <Navbar />
      <Box>
        <div style={{flex:'1'}}>
          {/* Title of the page */}
          <h1
            style={{
              position: "relative",
              color: headerCol,
              paddingTop: "20px",
            }}
          >
            Sign In
          </h1>
        </div>
        {/* Form submission handler */}
        <form className="form" onSubmit={handleSubmit} style={{flex:"5"}}>
          {/* Username input component */}
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
          
          <div className="divInputBox">
            <input        
              className="inputBox"
              type={type}
              value={password}
              onChange={handleChangePass}
              placeholder="Password123!"
              size="40"
              height="40px"
              maxLength={40}
              minLength={6}
              required
            />
            <img 
              src={eyeImg} 
              onClick={revealPassword} 
              className="password_eye" 
              style={{ position: "absolute" }}
              alt="password reveal eye"
            />
          <br />
          </div>
          <div className="errorMSG">
            {errorMessage && <span>{errorMessage}</span>}
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="submitButton"
              style={{ backgroundColor: backgroundColor, color: wordColor,cursor:'pointer' }}
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
            
          </div>
        </form>
        <div style={{flex:'5'}}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0px",
              fontSize:'14px'
            }}
          >
            <span style={{ position: "relative" }}>
              <Link
                to="/resetPassword"
                style={{ textDecoration: "none", color: "blue" ,paddingLeft:'20px',fontSize:'14px'}}
              >
                Forgot Password?
              </Link>
            </span>

            <span style={{ position: "relative" }}>
              <Link
                to="/Register"
                style={{ textDecoration: "none", color: "blue",paddingRight:'20px' }}
              >
                Register
              </Link>
            </span>
          </div>
          <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',marginTop:'10px ' }}>
            <hr style={{ width: '40%', border: '1px solid', color: backgroundColor, margin: '0 5%' }} />
            <span style={{ padding: '0' }}>or</span>
            <hr style={{ width: '40%', border: '1px solid', color: backgroundColor, margin: '0 5%' }} />
          </div>


          <button onClick={onGoogleSignIn} className="submitButton" style={{color:headerCol,marginTop:'10px',cursor:'pointer'}}>
            Sign in with Google
          </button>
          </div>
        </div>
      </Box>
    </div>
  );
}
