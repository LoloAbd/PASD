import React, { useState } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import AddAdminForm from '../Admin/AddAdmin';
import UpdateAdminForm from '../Admin/UpdateAdminInfo';
import ShowAdmins from '../Admin/ShowAllAdmins';

function Dashboard() {
    const [clicked, setClicked] = useState(false);
    const [adminDropdown, setAdminDropdown] = useState(false);  // State for Admin dropdown
    const [dataDropdown, setDataDropdown] = useState(false);    // State for Data dropdown
    const [showAddAdmin, setshowAddAdmin] = useState(false); 
    const [showUpdateAdmin, setshowUpdateAdmin] = useState(false);
    const [ShowAllAdmins, setShowAllAdmins] = useState(false);

    // Get the logged-in admin's username from localStorage
    const username = localStorage.getItem('adminUsername') || '';

    const isAdminAllowed = username.toUpperCase().startsWith('H');

    const handleClick = () => {
        setClicked(!clicked);
    };

    const toggleAdminDropdown = () => {
        setAdminDropdown(true);
    };

    const toggleDataDropdown = () => {
        setDataDropdown(true);
    };

    const AddAdmin = () => {
        setshowAddAdmin(true)
        setshowUpdateAdmin(false)
        setShowAllAdmins(false)
    }

    const updateAdmin = () => {
        setshowUpdateAdmin(true)
        setshowAddAdmin(false)
        setShowAllAdmins(false)
    }

    const showAllAdmins = () => {
        setShowAllAdmins(true)
        setshowUpdateAdmin(false)
        setshowAddAdmin(false)
        
    }

    return (
       <div className='home'>
            <nav className='NavBarItems'>
                <div>
                    <h1>PASD Admin Dashboard</h1>
                </div>

                <div className='menu-icons' onClick={handleClick}>
                    <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
                </div>

                <ul className={clicked ? "nav-menu active" : "nav-menu"}>
                    {/* Conditionally render Admin Management if allowed */}
                    {isAdminAllowed && (
                        <li className="nav-item">
                            <a className='nav-Links' onClick={toggleAdminDropdown}>
                                <i className='fa-solid fa-users'></i>Admin Management
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

                    {/* Data Management with Dropdown */}
                    <li className="nav-item">
                        <a className='nav-Links' onClick={toggleDataDropdown}>
                            <i className='fa-solid fa-database'></i>Data Management
                        </a>
                        {dataDropdown && (
                            <ul className="dropdown">
                                <li>
                                    <Link to="/ViewData" className="nav-Links">Buildings</Link>
                                </li>
                                <li>
                                    <Link to="/ViewData" className="nav-Links">Architects</Link>
                                </li>
                                <li>
                                    <Link to="/ImportData" className="nav-Links">Countries</Link>
                                </li>
                                <li>
                                    <Link to="/ViewData" className="nav-Links">Location</Link>
                                </li>
                                <li>
                                    <Link to="/ViewData" className="nav-Links">Owners</Link>
                                </li>
                                <li>
                                    <Link to="/ViewData" className="nav-Links">Tenants</Link>
                                </li>
                                <li>
                                    <Link to="/ViewData" className="nav-Links">Notaries</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
            {showAddAdmin && <AddAdminForm />}
            {showUpdateAdmin && <UpdateAdminForm />}
            {ShowAllAdmins && <ShowAdmins />}
        </div>
    );
}

export default Dashboard;
