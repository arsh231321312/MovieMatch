//Import necessary libraries and components
import React, { useState } from "react"; // React library for building UI and useState for state management
import CryptoJS from "crypto-js"; //Cryptographic operations
import "../App.css"; 
import "../APictures.css"; 
import { setGlobalState, useGlobalState } from "../GlobalVars"; // Global state management functions;
import RefreshButton from "./refresh";
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
            alert("failed")
          } else {
            const p=data.salt+password;
            let hash=(CryptoJS.SHA256(p).toString()); //Hash the username
            submit(hash);
          }
        })
  
        .catch((error) => {
          console.error("Error:", error);
        });
}
function approveRequest(username,email_exists,salt,passwordReqs){
    let p=salt+passwordReqs;
    let hashedpass=(CryptoJS.SHA256(p).toString()); //Hash the password
    const data={
        type: "ADMINAPPROVE",
        username:username,
        email_exists:email_exists,
        passwordReq:hashedpass,
        originalPass:passwordReqs
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
                alert("failed")
          } else {

                alert("suc");
            }
        })
  
        .catch((error) => {
          console.error("Error:", error);
        });
    
}
export function AdminLogin(){

    const [backgroundColor] = useGlobalState("backgroundColor");
    const [headerColor] = useGlobalState("headerColor");
    const [wordColor] = useGlobalState("wordColor");
    const [result,setResult] = useState([]);
    function handleRefresh(){
        const dataSalt={
            type:"GetChangePassReqs"
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
                alert("failed")
              } else { 
                setResult(data.result)
              }
            })
                  .catch((error) => {
              console.error("Error:", error);
            });
    }
    const s = {
        cursor: 'pointer',
        padding: '8px',
      };
    return (
        <div>
            {/* Main page container with dynamic background color */}
            <div className="page" style={{ backgroundColor: backgroundColor }}>
            
                {/* Header section */}
                <header className="header" style={{ backgroundColor: headerColor, color: wordColor }}>
                    ADMIN VIEW
                </header>
                
                <div className="box" style={{justifyContent:'center',alignItems:'center'}}>
                    <div>
                        <RefreshButton handleRefresh={handleRefresh} col={backgroundColor} s={s}/>                                            
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', overflowY: 'scroll', padding: '10px' ,alignItems:'center',justifyContent:'center',msOverflowStyle:'none',scrollbarWidth:'none'}}>
                        {result.map((item, index) => (
                            <div
                            key={index}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '15px',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                backgroundColor: '#f9f9f9',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            >
                            <span style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>{item[0]}</span>
                            <button
                                onClick={() => approveRequest(item[0],item[1],item[2],item[3])}
                                style={{
                                padding: '8px 16px',
                                backgroundColor: backgroundColor,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                }}
                            >
                                Approve
                            </button>
                            </div>
                        ))}
                    </div>



                </div>
            </div>
        </div>


    );
}