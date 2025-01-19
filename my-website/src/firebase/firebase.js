// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAsZUN-9YRJJ0P6r15lT9nUYr7kH3zcIco",
    authDomain: "letterboxd-9b62a.firebaseapp.com",
    projectId: "letterboxd-9b62a",
    storageBucket: "letterboxd-9b62a.firebasestorage.app",
    messagingSenderId: "193881776162",
    appId: "1:193881776162:web:e8f63e522b90a8aaafea7b",
    measurementId: "G-0YYRBTZT4X"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// const analytics = getAnalytics(app);
export {app,auth}
export const googleProvider = new GoogleAuthProvider();
