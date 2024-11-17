
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
import { isCookie,setCookie } from "./JSFUNCTIONS/Cookie";

//Date: 2024-11-15 changed made by: Katherine
//adding bootstrap import
// import 'bootstrap/dist/css/bootstrap.min.css';















