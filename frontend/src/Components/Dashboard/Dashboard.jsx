import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import AddAdminForm from '../Admin/AddAdmin';
import UpdateAdminForm from '../Admin/UpdateAdminInfo';
import ShowAdmins from '../Admin/ShowAllAdmins';

function Dashboard({ onLogout }) {
  const [clicked, setClicked] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [dataDropdown, setDataDropdown] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showUpdateAdmin, setShowUpdateAdmin] = useState(false);
  const [showAdmins, setShowAllAdmins] = useState(false);
  const [remainingTime, setRemainingTime] = useState(3600); // Default time is 3600 seconds (1 hour)
  const [showNotification, setShowNotification] = useState(false);

  const navigate = useNavigate();

  // Check if the session has been started before (on page load or refresh)
  useEffect(() => {
    const savedTime = localStorage.getItem('remainingTime');
    if (savedTime) {
      setRemainingTime(Number(savedTime)); // Restore the saved time from localStorage
    }

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        // Save the updated time back to localStorage each time it changes
        localStorage.setItem('remainingTime', prevTime - 1);
        return prevTime - 1;
      });
    }, 1000); // Update every second

    // Show notification when session is active
    if (remainingTime <= 3600 && remainingTime > 0) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }

    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, [remainingTime]);

  const handleSelection = (selection) => {
    localStorage.setItem('selectedTable', selection);
    console.log(`Saved "${selection}" to local storage`);
  };

  const isAdminAllowed = localStorage.getItem('adminUsername')?.toUpperCase().startsWith('H');

  const handleClick = () => {
    setClicked(!clicked);
  };

  const toggleAdminDropdown = () => {
    setAdminDropdown(!adminDropdown);
    setDataDropdown(false); // Close other dropdown
  };

  const toggleDataDropdown = () => {
    setDataDropdown(!dataDropdown);
    setAdminDropdown(false); // Close other dropdown
  };

  const AddAdmin = () => {
    setShowAddAdmin(true);
    setShowUpdateAdmin(false);
    setShowAllAdmins(false);
  };

  const updateAdmin = () => {
    setShowUpdateAdmin(true);
    setShowAddAdmin(false);
    setShowAllAdmins(false);
  };

  const showAllAdmins = () => {
    setShowAllAdmins(true);
    setShowUpdateAdmin(false);
    setShowAddAdmin(false);
  };

  const HideAll = () => {
    setShowAllAdmins(false);
    setShowUpdateAdmin(false);
    setShowAddAdmin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('remainingTime'); // Clear the remaining time when logging out
    onLogout(); // Notify App to clear login state
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="home">
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
            <a className="nav-Links" onClick={HideAll}>
              <i className="fa fa-home"></i>Home
            </a>
        </li>

          {isAdminAllowed && (
            <li className="nav-item">
              <a className="nav-Links" onClick={toggleAdminDropdown}>
                <i className="fa-solid fa-users"></i>Admin Management
              </a>
              {adminDropdown && (
                <ul className="dropdown">
                  <li onClick={AddAdmin}>
                    <a className="nav-Links">Add New Admin</a>
                  </li>
                  <li onClick={updateAdmin}>
                    <a className="nav-Links">Update Admin Information</a>
                  </li>
                  <li onClick={showAllAdmins}>
                    <a className="nav-Links">View All Admins</a>
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
                <li onClick={() => navigate('/ShowBuildings') && handleSelection('building')}>
                  <a className="nav-Links">Buildings</a>
                </li>
                <li onClick={() => navigate('/ImageSlider')}>
                  <a className="nav-Links">Buildings Image Gallery</a>
                </li>
                <li onClick={() => navigate('/Architects') && handleSelection('Architects')}>
                  <a className="nav-Links">Architects</a>
                </li>
                <li onClick={() => navigate('/Tenants') && handleSelection('tenants')}>
                  <a className="nav-Links">Tenant</a>
                </li>
                <li onClick={() => navigate('/Owners') && handleSelection('owners')}>
                  <a className="nav-Links">Owners</a>
                </li>
                <li onClick={() => navigate('/Notaries') && handleSelection('notaries')}>
                  <a className="nav-Links">Notaries</a>
                </li>
                <li onClick={() => navigate('/Cities') && handleSelection('cities')}>
                  <a className="nav-Links">Cities</a>
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
            <a className="nav-Links" style={{backgroundColor: "rgba(250, 0, 0, 0.3)", borderRadius: "10px"}}>
              <i class="fa fa-clock"></i>{Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? '0' : ''}{remainingTime % 60}
            </a>
            </li>
        </ul>
      </nav>

      {showAddAdmin && <AddAdminForm />}
      {showUpdateAdmin && <UpdateAdminForm />}
      {showAdmins && <ShowAdmins />}
    </div>
  );
}

export default Dashboard;
