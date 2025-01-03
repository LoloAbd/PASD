import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Components/Login/Login';
import ImageSlider from './Components/DataManagement/Buildings/ImageSlider';
import Architects from './Components/DataManagement/Architects/Architects';
import ShowBuildings from './Components/DataManagement/Buildings/ShowBuildings';
import Cities from './Components/DataManagement/City/Cities';
import Notaries from './Components/DataManagement/Notary/Notaries';
import Owners from './Components/DataManagement/Owners/Owners';
import Tenants from './Components/DataManagement/Tenant/Tenant';
import AddAdmin from './Components/Admin/AddAdmin';
import ShowAllAdmins from './Components/Admin/ShowAllAdmins';
import UpdateAdminInfo from './Components/Admin/UpdateAdminInfo';
import BuildingImages from './Components/DataManagement/Buildings/BuildingImages';
import AddBuildings from './Components/DataManagement/Buildings/AddBuildings';
import AddArchitects from './Components/DataManagement/Architects/AddArchitects';
import './Dashboard.css';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [dataDropdown, setDataDropdown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300); // Default time set to 5 minutes (300 seconds)
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

  const isAdminAllowed = localStorage.getItem('adminUsername')?.toUpperCase().startsWith('H');

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            // Session expired
            localStorage.removeItem('isLogin');
            localStorage.removeItem('remainingTime');
            return 0;
          }
          const updatedTime = prevTime - 1;
          localStorage.setItem('remainingTime', updatedTime);
          return updatedTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  useEffect(() => {
  const savedTime = localStorage.getItem('remainingTime');
  if (savedTime && getLocalStorageWithExpiry('isLogin')) {
    setRemainingTime(Number(savedTime)); // Restore saved time if logged in
  } else {
    setRemainingTime(3600); // Initialize to default 3600 seconds
  }
}, [isLogin]); // Run whenever the login state changes

const handleLogout = () => {
  localStorage.clear(); // Clear all login-related storage
  setIsLogin(false);
  setRemainingTime(0); // Reset timer to zero
  window.location.reload(); // Ensure the app resets
};

  useEffect(() => {
    // Check login status on initial render
    const loginStatus = getLocalStorageWithExpiry('isLogin');
    setIsLogin(!!loginStatus); // Set state based on login status
  }, []);


  const handleClick = () => {
    setClicked(!clicked); // Toggle the mobile menu
  };

  const toggleAdminDropdown = () => {
    setAdminDropdown(!adminDropdown);
    setDataDropdown(false); // Close other dropdown
  };

  const toggleDataDropdown = () => {
    setDataDropdown(!dataDropdown);
    setAdminDropdown(false); // Close other dropdown
  };

  return (
    <BrowserRouter>
      <div className='home'>
        <div>
          {isLogin && (
            <div>
              <nav className="NavBarItems">
                <div className="header-container" style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="./palestine.png" style={{ width: '45px', height: '45px', marginRight: '10px' }} alt="Palestine" />
                  <h2 className="h2Dashboard">PASD Admin Dashboard</h2>
                </div>

                <div className="menu-icons" onClick={handleClick}>
                  <i className={clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>

                <ul className={clicked ? 'nav-menu active' : 'nav-menu'}>
                  <li className="nav-item">
                    <Link to="/" className="nav-Links">
                      <i className="fa fa-home"></i>Home
                    </Link>
                  </li>

                  {isAdminAllowed && (
                    <li className="nav-item">
                      <a className="nav-Links" onClick={toggleAdminDropdown}>
                        <i className="fa-solid fa-users"></i>Admin Management
                      </a>
                      {adminDropdown && (
                        <ul className="dropdown">
                          <li>
                            <Link to="/AddAdmin" className="nav-Links">Add New Admin</Link>
                          </li>
                          <li>
                            <Link to="/UpdateAdminInfo" className="nav-Links">Update Admin Information</Link>
                          </li>
                          <li>
                            <Link to="/ShowAllAdmins" className="nav-Links">View All Admins</Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  )}

                  <li className="nav-item">
                    <a className="nav-Links" onClick={toggleDataDropdown}>
                      <i className="fa-solid fa-database"></i>Data Management
                    </a>
                    {dataDropdown && (
                      <ul className="dropdown">
                        <li>
                          <Link to="/ShowBuildings" className="nav-Links">Buildings</Link>
                        </li>
                        <li>
                          <Link to="/BuildingImages" className="nav-Links">Add Images for Buildings</Link>
                        </li>
                        <li>
                          <Link to="/ImageSlider" className="nav-Links">Buildings Image Gallery</Link>
                        </li>
                        <li>
                          <Link to="/Architects" className="nav-Links">Architects</Link>
                        </li>
                        <li>
                          <Link to="/Tenants" className="nav-Links">Tenant</Link>
                        </li>
                        <li>
                          <Link to="/Owners" className="nav-Links">Owners</Link>
                        </li>
                        <li>
                          <Link to="/Notaries" className="nav-Links">Notaries</Link>
                        </li>
                        <li>
                          <Link to="/Cities" className="nav-Links">Cities</Link>
                        </li>
                      </ul>
                    )}
                  </li>

                  <li className="nav-item">
                    <a className="nav-Links" onClick={handleLogout}>
                      <i className="fa fa-sign-out"></i>Logout
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                        className="nav-Links"
                        style={{ backgroundColor: "rgba(250, 0, 0, 0.3)", borderRadius: "10px" }}
                      >
                        <i className="fa fa-clock"></i>
                        {remainingTime > 0
                          ? `${Math.floor(remainingTime / 60)}:${remainingTime % 60 < 10 ? '0' : ''}${remainingTime % 60}`
                          : 'Session Expired'}
                      </a>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>

        <Routes>
          {isLogin ? (
            <>
              <Route path="/" element={<index />} />
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
