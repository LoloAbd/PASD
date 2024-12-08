import React, { useState } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import AddAdminForm from '../Admin/AddAdmin';
import UpdateAdminForm from '../Admin/UpdateAdminInfo';
import ShowAdmins from '../Admin/ShowAllAdmins';
import Notaries from '../DataManagement/Notaries'

function Dashboard() {
  
    const [clicked, setClicked] = useState(false);
    const [adminDropdown, setAdminDropdown] = useState(false);  // State for Admin dropdown
    const [dataDropdown, setDataDropdown] = useState(false);    // State for Data dropdown
    const [showAddAdmin, setshowAddAdmin] = useState(false); 
    const [showUpdateAdmin, setshowUpdateAdmin] = useState(false);
    const [ShowAllAdmins, setShowAllAdmins] = useState(false);
    const [ShowNotaries, setShowNotaries] = useState(false);

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
        setShowNotaries(false)
    }

    const updateAdmin = () => {
        setshowUpdateAdmin(true)
        setshowAddAdmin(false)
        setShowAllAdmins(false)
        setShowNotaries(false)
    }

    const showAllAdmins = () => {
        setShowAllAdmins(true)
        setshowUpdateAdmin(false)
        setshowAddAdmin(false)
        setShowNotaries(false)
    }
    const ShowNotarie = () => {
        setShowNotaries(true)
        setShowAllAdmins(false)
        setshowUpdateAdmin(false)
        setshowAddAdmin(false)
    }

    const HideAll = () => {
        setShowAllAdmins(false)
        setshowUpdateAdmin(false)
        setshowAddAdmin(false)
        setShowNotaries(false)
    }

    return (
       <div className='home'>
            <nav className='NavBarItems'>
                <div>
                    <h2 className='h2Dashboard'>PASD Admin Dashboard</h2>
                </div>

                <div className='menu-icons' onClick={handleClick}>
                    <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
                </div>

                <ul className={clicked ? "nav-menu active" : "nav-menu"}>
                    <li>
                        <Link to='/' className='nav-Links' onClick={HideAll}>
                            <i className='fa-solid fa-home'></i>Home
                        </Link>
                    </li>

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
                                    <a className="nav-Links">Buildings</a>
                                </li>
                                <li>
                                    <a className="nav-Links">Architects</a>
                                </li>
                                <li>
                                    <a className="nav-Links">Countries</a>
                                </li>
                                <li>
                                    <a className="nav-Links">Location</a>
                                </li>
                                <li>
                                    <a className="nav-Links">Owners</a>
                                </li>
                                <li onClick={ShowNotarie}>
                                    <a className="nav-Links">Notaries</a>
                                </li>
                            </ul>
                        )}
                    </li>

                     <li>
                        <Link to='/' className='nav-Links'>
                            <i className='fa fa-sign-out'></i>Logout
                        </Link>
                    </li>

                </ul>
            </nav>
            {showAddAdmin && <AddAdminForm />}
            {showUpdateAdmin && <UpdateAdminForm />}
            {ShowAllAdmins && <ShowAdmins />}
            {ShowNotaries && <Notaries />}
        </div>
    );
}

export default Dashboard;
