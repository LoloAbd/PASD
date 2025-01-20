import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Components/Login/Login";
import ImageSlider from "./Components/DataManagement/Buildings/ImageSlider";
import Architects from "./Components/DataManagement/Architects/Architects";
import ShowBuildings from "./Components/DataManagement/Buildings/ShowBuildings";
import Cities from "./Components/DataManagement/City/Cities";
import Notaries from "./Components/DataManagement/Notary/Notaries";
import Owners from "./Components/DataManagement/Owners/Owners";
import Tenants from "./Components/DataManagement/Tenant/Tenant";
import AddAdmin from "./Components/Admin/AddAdmin";
import ShowAllAdmins from "./Components/Admin/ShowAllAdmins";
import UpdateAdminInfo from "./Components/Admin/UpdateAdminInfo";
import BuildingImages from "./Components/DataManagement/Buildings/BuildingImages";
import AddBuildings from "./Components/DataManagement/Buildings/AddBuildings";
import AddArchitects from "./Components/DataManagement/Architects/AddArchitects";
import Home from "./Home/Home";
import "./Dashboard.css";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [remainingTime, setRemainingTime] = useState(3600); // Default time set to 60 minutes (3600 seconds)
  const [clicked, setClicked] = useState(false);

  // Function to check localStorage for login status
  const getLocalStorageWithExpiry = (key) => {
    // Get the stored item from localStorage by the given key
    const itemStr = localStorage.getItem(key);
    
    // If the item doesn't exist in localStorage, return null
    if (!itemStr) return null;

    // Parse the item into a JavaScript object
    const item = JSON.parse(itemStr);

    // Check if the current time exceeds the stored expiry time
    if (Date.now() > item.expiryTime) {
      // If expired, remove the item from localStorage
      localStorage.removeItem(key);
      return null;
    }
    
    // Return the value of the item if it's still valid
    return item.value;
  };

  // Function to handle logout
  const handleLogout = () => {
    // Remove login-related items from localStorage
    localStorage.removeItem("isLogin");
    localStorage.removeItem("remainingTime");
    localStorage.removeItem("adminUsername");
    
    // Set the login state to false (logged out)
    setIsLogin(false);

    // Reset the remaining time to 0
    setRemainingTime(0); 

    // Reload the page to reset the app state
    window.location.reload(); 
  };

  // Function to format remaining time as MM:SS
  const formatTime = (time) => {
    // Calculate the minutes part of the time
    const minutes = Math.floor(time / 60);
    
    // Calculate the seconds part of the time
    const seconds = time % 60;
    
    // Return formatted string in MM:SS format
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Effect to initialize login status and remaining time
  useEffect(() => {
    // Check if there is a saved login status in localStorage
    const loginStatus = getLocalStorageWithExpiry("isLogin");
    
    // Set the login state based on whether the status exists and is valid
    setIsLogin(!!loginStatus);

    // Retrieve the saved remaining time from localStorage
    const savedTime = localStorage.getItem("remainingTime");
    
    // If there is a saved time and the user is logged in, restore the remaining time
    if (savedTime && loginStatus) {
      setRemainingTime(Number(savedTime)); 
    } else {
      // Initialize remaining time to 3600 seconds (1 hour) if not logged in
      setRemainingTime(3600); 
    }
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  // Effect to handle the countdown timer
  useEffect(() => {
    // If the remaining time is greater than 0, start the countdown
    if (remainingTime > 0) {
      // Set an interval to decrement the remaining time every second
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          // If time is about to expire, log the user out
          if (prevTime <= 1) {
            handleLogout(); // Logout when time expires
            return 0;
          }
          
          // Otherwise, decrease the time by 1 second and update localStorage
          const updatedTime = prevTime - 1;
          localStorage.setItem("remainingTime", updatedTime);
          return updatedTime;
        });
      }, 1000);

      // Cleanup the interval on component unmount or time change
      return () => clearInterval(timer);
    }
  }, [remainingTime]); // The effect depends on remainingTime and will run whenever it changes

  // Toggle mobile menu
  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <BrowserRouter>
      <div>
        {isLogin && (
          <div>
            <nav className="NavBarItems">
              <div
                className="header-container"
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src="./icon.png"
                  style={{ width: "45px", height: "45px", marginRight: "10px" }}
                  alt="icon"
                />
                <h2 className="h2Dashboard">PASD Admin Dashboard</h2>
              </div>

              <div className="menu-icons" onClick={handleClick}>
                <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
              </div>

              <ul className={clicked ? "nav-menu active" : "nav-menu"}>
                <li className="nav-item">
                  <Link to="/" className="nav-Links">
                    <i className="fa fa-home"></i>Home
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-Links" onClick={handleLogout}>
                    <i className="fa fa-sign-out"></i>Logout
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-Links"
                    style={{
                      backgroundColor: "rgba(250, 0, 0, 0.3)",
                      borderRadius: "10px",
                    }}
                  >
                    <i className="fa fa-clock"></i>
                    {remainingTime > 0
                      ? formatTime(remainingTime)
                      : "Session Expired"}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}

        <Routes>
          {isLogin ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/ImageSlider" element={<ImageSlider />} />
              <Route path="/Architects" element={<Architects />} />
              <Route path="/ShowBuildings" element={<ShowBuildings />} />
              <Route path="/Cities" element={<Cities />} />
              <Route path="/Notaries" element={<Notaries />} />
              <Route path="/Owners" element={<Owners />} />
              <Route path="/Tenants" element={<Tenants />} />
              <Route path="/AddAdmin" element={<AddAdmin />} />
              <Route path="/ShowAllAdmins" element={<ShowAllAdmins />} />
              <Route path="/UpdateAdminInfo" element={<UpdateAdminInfo />} />
              <Route path="/BuildingImages" element={<BuildingImages />} />
              <Route path="/AddBuildings" element={<AddBuildings />} />
              <Route path="/AddArchitects" element={<AddArchitects />} />
            </>
          ) : (
            <>
              <Route path="*" element={<Login onLogin={() => setIsLogin(true)} />} />
              <Route path="/" element={<Login onLogin={() => setIsLogin(true)} />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;