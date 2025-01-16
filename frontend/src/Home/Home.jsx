import React, { useState, useEffect, useRef } from 'react';
import './Home.css'; // Import the CSS file
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faDatabase,
  faUserPlus,
  faUserEdit,
  faUsersCog,
  faBuilding,
  faImage,
  faImages,
  faUserTie,
  faHouseUser,
  faUserShield,
  faCity,
} from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [adminOpen, setAdminOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const adminRef = useRef(null);
  const dataRef = useRef(null);

  const isAdminAllowed = localStorage.getItem('adminUsername')?.toUpperCase().startsWith('H');

  const toggleAdmin = (e) => {
    e.stopPropagation(); // Prevent the click from reaching the document listener
    setAdminOpen(!adminOpen);
    setDataOpen(false); // Close the other dropdown
  };

  const toggleData = (e) => {
    e.stopPropagation(); // Prevent the click from reaching the document listener
    setDataOpen(!dataOpen);
    setAdminOpen(false); // Close the other dropdown
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setAdminOpen(false);
      }
      if (dataRef.current && !dataRef.current.contains(event.target)) {
        setDataOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="body">
      <nav className="menu">
        <ul>
          {/* Conditionally render Admin Management if isAdminAllowed is true */}
          {isAdminAllowed && (
            <li ref={adminRef} className="menu-item">
              <a onClick={toggleAdmin}>
                <FontAwesomeIcon icon={faUsers} className="icon" /> Admin Management
              </a>
              {adminOpen && (
                <ul className="dropdown">
                  <li>
                    <Link to="/AddAdmin" className="Link">
                      <FontAwesomeIcon icon={faUserPlus} className="icon" /> Add New Admin
                    </Link>
                  </li>
                  <li>
                    <Link to="/UpdateAdminInfo" className="Link">
                      <FontAwesomeIcon icon={faUserEdit} className="icon" /> Update Admin Information
                    </Link>
                  </li>
                  <li>
                    <Link to="/ShowAllAdmins" className="Link">
                      <FontAwesomeIcon icon={faUsersCog} className="icon" /> View All Admins
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Data Management */}
          <li ref={dataRef} className="menu-item">
            <a onClick={toggleData}>
              <FontAwesomeIcon icon={faDatabase} className="icon" /> Data Management
            </a>
            {dataOpen && (
              <ul className="dropdown">
                <li>
                  <Link to="/ShowBuildings" className="Link">
                    <FontAwesomeIcon icon={faBuilding} className="icon" /> Buildings
                  </Link>
                </li>
                <li>
                  <Link to="/BuildingImages" className="Link">
                    <FontAwesomeIcon icon={faImage} className="icon" /> Add Images for Buildings
                  </Link>
                </li>
                <li>
                  <Link to="/ImageSlider" className="Link">
                    <FontAwesomeIcon icon={faImages} className="icon" /> Buildings Image Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/Architects" className="Link">
                    <FontAwesomeIcon icon={faUserTie} className="icon" /> Architects
                  </Link>
                </li>
                <li>
                  <Link to="/Tenants" className="Link">
                    <FontAwesomeIcon icon={faHouseUser} className="icon" /> Tenants
                  </Link>
                </li>
                <li>
                  <Link to="/Owners" className="Link">
                    <FontAwesomeIcon icon={faUserShield} className="icon" /> Owners
                  </Link>
                </li>
                <li>
                  <Link to="/Notaries" className="Link">
                    <FontAwesomeIcon icon={faUserTie} className="icon" /> Notaries
                  </Link>
                </li>
                <li>
                  <Link to="/Cities" className="Link">
                    <FontAwesomeIcon icon={faCity} className="icon" /> Cities
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;