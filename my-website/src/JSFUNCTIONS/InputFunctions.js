
//Import necessary libraries and components
import React from "react"; // React library for building UI and useState for state management
import "../App.css"; 
import eye_closed from "../pictures/eye_closed.png"; 
import "../APictures.css"; 


// Component for the main page

export function UsernameInput({ username, handleChangeUser, handleInvalid }) {
    //Function to handle changes in the username input field
    return (
      <div className="divInputBox">
        <input
          className="inputBox"
          type="username"
          value={username}
          size="40"
          height="40px"
          maxLength={40}
          minLength={6}
          placeholder=" Username"
          onInput={handleChangeUser}
          onInvalid={handleInvalid}
          required
        />
        <br />
      </div>
    );
  }
  
// Component for the password input field
export function PasswordInput({
    password,
    handleChangePass,
    handleInvalid,
    eye_change,
    revealPassword,
  }) {
    return (
      //Function to handle changes in the password input field
      <div className="divInputBox" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <input
          type={revealPassword && "password"}
          className="inputBox"
          value={password}
          size="40"
          height="40px"
          pattern="(?=.*\W)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).*"
          maxLength={40}
          minLength={8}
          placeholder={" Password123!"} 
          onInput={handleChangePass}
          onInvalid={handleInvalid}
          required
        />
  
        {/* Password visibility toggle */}
        {revealPassword && (
          <img
            src={eye_closed}
            alt="password_eye_open"
            className="password_eye"
            onClick={eye_change}
            style={{position:'absolute'}}
          ></img>
        )}
  
  
        {/* Password visibility toggle */}
        {!revealPassword && (
          <img
            src={
              "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-eye-512.png"
            }
            alt="password_eye_closed"
            className="password_eye"
            onClick={eye_change}
            style={{position:'absolute'}}
          ></img>
        )}
      </div>
    );
}
  
// Component for the email input field
export function EmailInput({ email, handleChangeEmail, handleSubmit }) {
    return (
      <div className="divInputBox">
        <input
          className="inputBox"
          type="email"
          value={email}
          size="40"
          height="40px"
          placeholder={"Example@gmail.com"}
          onInput={handleChangeEmail}
          maxLength={40}
          minLength={6}
          title="Must contain at least one number and one uppercase letter"
          onInvalid={handleSubmit}
          required
        />
      </div>
    );
}

// Component for the main page
export const Box = ({ children, width, height, backgroundColor }) => {
    return (
      <div className="box" style={{ width, height, backgroundColor }}>
        {children}
      </div>
    );
};