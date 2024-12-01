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
import bcrypt from 'bcryptjs';

export function adminPost(hashedUser,password){
    function submit(hash){
        const data = {
            username: hashedUser,
            password: hash,
            type: "ADMIN",
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
                alert(data.message);
                return false;
              } else {
                //login success
                setGlobalState("ADMIN", true);
                // setCookie('authToken', data.token, 15); //Set the authentication token in cookies
                // setLoginFail(false);
                return true;
              }
            })
      
            //toggles password visibilty through the eye icon
            .catch((error) => {
              console.error("Error:", error);
              return false;
            });
            return false;
    }
    const dataSalt={
        username: hashedUser,
        type: "ADMINSALT",
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
            setGlobalState('ADMIN',false);
            // setLoginFailMSG(data.message);
            // setLoginFail(true);
            alert("failed")
          } else {
            //login success
            // setGlobalState("usesEmail", emailExists); //tracks if email already exists
            // setGlobalState("account", hashedUser);
            const p=data.salt+password;
            let hash=(CryptoJS.SHA256(p).toString()); //Hash the username
            submit(hash);
          }
        })
  
        //toggles password visibilty through the eye icon
        .catch((error) => {
          console.error("Error:", error);
        });
}

export function AdminLogin(){
    const [backgroundColor] = useGlobalState("backgroundColor");
    const [headerColor] = useGlobalState("headerColor");
    const [wordColor] = useGlobalState("wordColor");
    const [result] = useState([]);
    return (
        <div>
            {/* Main page container with dynamic background color */}
            <div className="page" style={{ backgroundColor: backgroundColor }}>
            
                {/* Header section */}
                <header className="header" style={{ backgroundColor: headerColor, color: wordColor }}>
                    ADMIN VIEW
                </header>

                <div className="box">
                    {result.map((item, index) => (
                        <h1>hello</h1>
                    ))}
                </div>
            </div>
        </div>


    );
}