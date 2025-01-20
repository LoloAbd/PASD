import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ShowAllAdmins.css";
import { FaEye, FaRegTrashAlt } from "react-icons/fa";
import logAction from "../logAction";
import Pagination from "../Pagination";


const ShowAllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLogPage, setCurrentLogPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [logsPerPage] = useState(8);

  // Fetch all admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get("http://localhost:3001/getAdmins");
        setAdmins(res.data);
      } catch (err) {
        console.error("Error fetching admins:", err);
        alert("Failed to fetch admins. Please try again.");
      }
    };
    fetchAdmins();
  }, []);

  // Fetch logs for the selected admin
  const handleViewLogs = async (adminUsername) => {
    try {
      const res = await axios.get(`http://localhost:3001/logs/${adminUsername}`);
      setLogs(res.data);
      setSelectedAdmin(adminUsername);
      setShowLogs(true);
      setCurrentLogPage(1);
    } catch (err) {
      console.error("Error fetching logs:", err);
      alert("Failed to fetch logs. Please try again.");
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async (adminId) => {
    const adminToDelete = admins.find((admin) => admin._id === adminId);
    if (!adminToDelete) {
      alert("Admin not found.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${adminToDelete.first_name} ${adminToDelete.last_name}?`
    );

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/deleteAdmin/${adminId}`);
        setAdmins(admins.filter((admin) => admin._id !== adminId));
        logAction("Delete Admin", [
          adminToDelete.first_name,
          adminToDelete.last_name,
        ]);
        alert("Admin deleted successfully!");
      } catch (err) {
        console.error("Error deleting admin:", err);
        alert("Failed to delete admin. Please try again.");
      }
    }
  };

  // Pagination logic
  const getPaginatedData = (data, currentPage, itemsPerPage) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  const currentAdmins = getPaginatedData(admins, currentPage, itemsPerPage);
  const currentLogs = getPaginatedData(logs, currentLogPage, logsPerPage);

  return (
    <div className="showAllAdmins">
      {showLogs ? (
        <>
          <h1>Logs for {selectedAdmin}</h1>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{width: "200px"}}>Action</th>
                <th>Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => (
                  <tr key={index}>
                    <td style={{width: "200px"}}>{log.action}</td>
                    <td>{log.details}</td>
                    <td>{log.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No logs found for this admin.</td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentLogPage}
            totalItems={logs.length}
            itemsPerPage={logsPerPage}
            onPageChange={setCurrentLogPage}
          />

          <button className="submit-button" onClick={() => setShowLogs(false)}>
            Back to Admins
          </button>
        </>
      ) : (
        <>
          <h1>All Admins</h1>
          <table className="adminTableContainer">
            <thead>
              <tr>
                <th style={{width: "150px"}}>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Username</th>
                <th style={{width: "300px"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAdmins.length > 0 ? (
                currentAdmins.map((admin) => (
                  <tr key={admin._id}>
                    <td>{admin.first_name}</td>
                    <td>{admin.last_name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.username}</td>
                    <td>
                      <button className="delete-button"
                        
                        onClick={() => handleDeleteAdmin(admin._id)} >
                        <FaRegTrashAlt  />
                      </button>
                      <button
                        className="view-button"
                        onClick={() => handleViewLogs(admin.username)}
                      >
                        <FaEye /> View Admin Logs
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalItems={admins.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default ShowAllAdmins;