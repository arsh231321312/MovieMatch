import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import { useGlobalState } from './GlobalVars';
import { Component, useState } from 'react';
import {SignInForm} from './JSFUNCTIONS/Login';
import { SignUpForm } from './JSFUNCTIONS/Register';
import { FrontPage } from './JSFUNCTIONS/FrontPage';
import { FrontPageMobile } from './JSFUNCTIONS/FrontPageMobile';
import { ResetPasswordForm } from './JSFUNCTIONS/ResetPassword';
import { MainPage } from './JSFUNCTIONS/MainPage';
import { AdminLogin } from './JSFUNCTIONS/Admin';
const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [isAuthenticated]=useGlobalState('authenticated')
  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/Login" />
  );
};
const ProtectedRouteADMIN = ({ element: Component, ...rest }) => {
  const [ADMIN]=useGlobalState('ADMIN')
  return ADMIN ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/Login" />
  );
};
function App() { 
    const [mediaOption] = useState(window.innerWidth>800)
    return ( 
      

      
        <div >
          
          <Router>
            <Routes>
              {/* {
                (mediaOption) && <Route path="/" element={<FrontPage />} />
              }
              {
                (!mediaOption) && <Route path="/" element={<FrontPageMobile />} />
              } */}
              
              <Route path="/" element={<FrontPage />} />
              
              
              <Route path="/Register" element={<SignUpForm />} />
              <Route path="/Login" element={<SignInForm />} />
              <Route path="/resetPassword" element={<ResetPasswordForm />} />
              <Route
                path="/mainPage"
                element={<ProtectedRoute element={MainPage} />}
              />
              <Route path='/ADMIN' element={<ProtectedRouteADMIN element={AdminLogin}/>} />
            </Routes>
          </Router>
         </div>
      
      
    ); 
} 
  
export default App; 
