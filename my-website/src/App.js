import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import {SignInForm} from './JSFUNCTIONS/Login';
import { SignUpForm } from './JSFUNCTIONS/Register';
import { FrontPage } from './JSFUNCTIONS/FrontPage';
import { ResetPasswordForm } from './JSFUNCTIONS/ResetPassword';
import { MainPage } from './JSFUNCTIONS/MainPage';
import { useAuth } from "./contexts/authContext/index.jsx";
// import Header from './components/Header'; // Import the Header component
// import MainContent from './components/MainContent'; // Import other components
const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { userLoggedIn } = useAuth(); // Correctly access userLoggedIn
  return userLoggedIn ? <Component {...rest} /> : <Navigate to="/Login" />;
};

function App() { 
    // const [mediaOption] = useState(window.innerWidth>800)
    return ( 

      
        <div >
          
          <Router>
            <Routes>
              
              
              <Route path="/" element={<FrontPage />} />
              
              
              <Route path="/Register" element={<SignUpForm />} />
              <Route path="/Login" element={<SignInForm />} />
              <Route path="/resetPassword" element={<ResetPasswordForm />} />
              <Route
                path="/mainPage"
                element={<ProtectedRoute element={MainPage} />}
              />
            </Routes>
          </Router>
         </div>
      
      
    ); 
} 
  
export default App; 
