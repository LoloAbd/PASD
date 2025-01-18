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
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiryTime) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("remainingTime");
    localStorage.removeItem("adminUsername");
    setIsLogin(false);
    setRemainingTime(0); // Reset timer to zero
    window.location.reload(); // Ensure the app resets
  };

  // Function to format remaining time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Effect to initialize login status and remaining time
  useEffect(() => {
    const loginStatus = getLocalStorageWithExpiry("isLogin");
    setIsLogin(!!loginStatus);

    const savedTime = localStorage.getItem("remainingTime");
    if (savedTime && loginStatus) {
      setRemainingTime(Number(savedTime)); // Restore saved time if logged in
    } else {
      setRemainingTime(3600); // Initialize to default 3600 seconds
    }
  }, []);

  // Effect to handle the countdown timer
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            handleLogout(); // Logout when time expires
            return 0;
          }
          const updatedTime = prevTime - 1;
          localStorage.setItem("remainingTime", updatedTime);
          return updatedTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

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