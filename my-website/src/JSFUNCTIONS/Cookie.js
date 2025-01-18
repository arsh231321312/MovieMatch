//Import necessary libraries and components
import React from "react";
import "../App.css";
import "../APictures.css";
import { setGlobalState } from "../GlobalVars"; // Global state management functions
import { jwtDecode } from "jwt-decode"; // Library to decode JSON web tokens

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
export function isCookie() {
  const token = getCookie("authToken"); //Retrieve authentication token from cookies
  if (token === null) {
    //If the token does not exist
    return false;
  }
  const decodedToken = jwtDecode(token); //Decode the token
  const username = decodedToken.username; //Retrieve the username from the token
  const emailExists = decodedToken.emailExists;
  setGlobalState("usesEmail", emailExists); // Update email status
  setGlobalState("account", username); // Update username
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
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Function to remove a cookie
export const removeCookie = (name) => {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
};
