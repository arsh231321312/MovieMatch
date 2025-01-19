import React from "react";
import "../../App.css";
import darkSun from "../../pictures/sun.png";
import sun from "../../pictures/sunBright.png";
import { setGlobalState, useGlobalState } from "../../GlobalVars";

const Dropdown = ({ children }) => {
  const [darkMode] = useGlobalState("DarkMode");
  // const [headerColor] = useGlobalState("headerColor");
  // const [wordColor] = useGlobalState("wordColor");
  // const [isMobile, setIsMobile] = useState(false);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function dark_mode() {
    if (darkMode) {
      setGlobalState("DarkMode", false);
      setGlobalState("headerColor", "#708090");
      setGlobalState("wordColor", "black");
      setGlobalState("backgroundColor", "#f0eee9");
    } else {
      setGlobalState("DarkMode", true);
      setGlobalState("headerColor", "#07000f");
      setGlobalState("wordColor", "white");
      setGlobalState("backgroundColor", "#1f2833");
    }
  }
  return (
    <>
      <div className="dropdown-menu">
        {children}

        <div className="sun" style={{ padding: 0 }}>
          <img
            src={darkMode ? darkSun : sun}
            alt="dark mode toggle"
            className="dark_mode"
            onClick={dark_mode}
            style={{ width: "30px", cursor: "pointer" }}
          />
        </div>
      </div>
    </>
  );
};

export default Dropdown;
