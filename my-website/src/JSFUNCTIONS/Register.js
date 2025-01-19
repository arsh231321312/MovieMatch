//Import necessary libraries and components
import React, { useState } from "react"; // React library for building UI and useState for state management
import { Link, Navigate } from "react-router-dom"; // Navigation components for routing
import "../App.css";
import "../APictures.css";
import {  useGlobalState } from "../GlobalVars"; // Global state management functions
import { Box } from "./InputFunctions";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from '../firebase/firebase.js'
import { doSignInWithGoogle } from "../firebase/auth";
import { useNavigate } from 'react-router-dom';
import eyeClosed from '../pictures/eye_closed.png';
// import { onAuthStateChanged } from "firebase/auth";
import { Navbar } from "./navbar/Navbar.js";
export function SignUpForm() {
  const [backgroundColor] = useGlobalState("backgroundColor");
  const [wordColor] = useGlobalState("wordColor");
  const [headerCol] = useGlobalState('headerColor');

  const [email,setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userLoggedIn,setUserLoggedIn] = useState(false);
  
  const [isSigningIn,setIsSigningIn] = useState(false);
  const navigate = useNavigate();
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
  
  const onGoogleSignIn = (e) => {
      e.preventDefault();
      if (!isSigningIn){
        setIsSigningIn(true);

        doSignInWithGoogle()
        .then(()=>{
          setUserLoggedIn(true);
          navigate('/mainPage')
        })
        .catch(err => {
          setIsSigningIn(false);
        })
      }
    }
  // const handleSubmit = async () => {
  //   try {
  //   await createUserWithEmailAndPassword(auth,email,password);
  //     setUserLoggedIn(true)
  //     navigate('/mainPage')
  //   }catch(err){
  //     setUserLoggedIn(false)
  //     console.error(err)
  //   }
  // };
  const handleSubmit = (e) =>{
    e.preventDefault()
    setIsSigningIn(false);
    if (!isSigningIn){
      setIsSigningIn(true);

      createUserWithEmailAndPassword(auth,email,password)
      .then(()=>{
        
        setUserLoggedIn(true);
        navigate('/Login')

      })
      .catch(err => {
        setIsSigningIn(false);
        console.log(err.code);
        if (err.code ==='auth/email-already-in-use')
          setErrorMessage("Email already in use")
        else if (err.code ==='auth/invalid-email')
          setErrorMessage('Invalid Email')
        else{
          setErrorMessage("Unknown Error")
        }
      })
    }
  }
  const handleChangeEmail = (e) =>{
    setEmail(e.target.value)
  }
  const handleChangePass = (e) =>{
    setPassword(e.target.value)
  }

  // Main component return
  return (
    <div className="page" style={{ backgroundColor: backgroundColor }}>
      {/* Navigate to main page if the condition is met */}
      {userLoggedIn && <Navigate to="/mainPage" />}
      <Navbar/>
      <Box>
        <div style={{flex:'1'}}>
          <h1
            style={{
              position: "relative",
              color: headerCol,
              paddingTop: "20px",
            }}
          >
            {" "}
            Register
          </h1>
        </div>
        <div style={{flex:'5'}}>
          <form className="form" onSubmit={handleSubmit}>
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
            <br/>
          </div>
          <div className="errorMSG">
            {errorMessage && <span>{errorMessage}</span>}
          </div>

            <div>
              <button
                type="submit"
                className="submitButton"
                style={{backgroundColor:backgroundColor,color:wordColor,cursor:'pointer' }}
              >
                Submit
              </button>
            </div>

            {/* Display error message if login fails */}
          </form>
        </div>
        <div style={{flex:'5'}}>
          {/* Section for users who already have an account */}
          <div className="divExistingACC">
            <span style={{ color: headerCol }}>
              Have an account?
            </span>
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',marginTop:'10px' }}>
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
