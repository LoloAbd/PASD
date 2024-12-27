import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import "./DataPage.css";

const Notaries = () => {
  const [notaries, setNotaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
        // Fetch all admins from the server
        axios.get('http://localhost:3001/notaries') // Adjust URL if needed
            .then(res => {
                setNotaries(res.data); // Save the fetched data in the state
            })
            .catch(err => {
                console.error("Error fetching Notaries:", err);
            });
    }, []);

  const handleSort = (columnName) => {
    console.log("Sorting column:", columnName);
    let direction = "asc";
    if (sortConfig.key === columnName && sortConfig.direction === "asc") {
        direction = "desc";
    }
    setSortConfig({ key: columnName, direction });

    const sortedData = [...notaries].sort((a, b) => {
        console.log("Comparing:", a[columnName], b[columnName]);
        if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
        if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
        return 0;
    });
    console.log("Sorted Data:", sortedData);
    setNotaries(sortedData);
};

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

   const handleEdit = (id) => {
    const newName = prompt('Enter new name:');
  
    if (newName) {
      axios.put(`http://localhost:3001/notaries/${id}`, { name: newName })
      .then((res) => {
        alert('Notary updated successfully');
        setNotaries(
          notaries.map((notary) =>
            notary._id === id ? { ...notary, name: newName } : notary
          )
        );
      })
      .catch((err) => {
        console.error('Error updating notary:', err);
        alert('Failed to update notary');
      });
    
    }
  };

  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notary?')) {
      axios
      
        .delete(`http://localhost:3001/notaries/${id}`)
        .then((res) => {
          console.log("Received ID for deletion:", id);
          console.log('Attempting to delete notary with ID:', id);
          alert('Notary deleted successfully');
          setNotaries(notaries.filter((notary) => notary._id !== id)); // Update UI
        })
        .catch((err) => {
          console.log('Attempting to delete notary with ID:', id);
          console.error('Error deleting notary:', err);
          alert('Failed to delete notary');
        });
    }
  };
  

  const filteredNotaries = notaries.filter((notary) =>
    Object.values(notary).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotaries = filteredNotaries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="table-container">
      <h1>Notaries</h1>
      
      <div className="controls">
        <input type="text" className="form-control search-bar" placeholder="Search..." value={searchTerm}  onChange={handleSearch} />
        <button className="btn btn-primary add-button"><FaPlus /> </button>
      </div>

      <table className="custom-table">
          <thead>
          <tr>
            <th><AiOutlineFieldNumber /></th>
            <th onClick={() => handleSort("num")}>
              Notary ID <span><BiSortAlt2 /></span>
            </th>
            <th onClick={() => handleSort("name")}>
              Notary Name <span><BiSortAlt2 /></span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>

         <tbody>
          {notaries.length > 0 ? (
            currentNotaries.map((notary, index) => (
              <tr key={notary._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{notary._id}</td>
                <td>{notary.name}</td>
                <td>
                <button className="edit-button" onClick={() => handleEdit(notary._id)}><FaEdit /> </button>
                <button className="delete-button" onClick={() => handleDelete(notary._id)}><FaTrash /></button>
                </td>
              </tr>
            ))
            ) : (
            <tr>
            <td colSpan="4">No notaries found.</td>
            </tr>
            )}
        </tbody>

      </table>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredNotaries.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Notaries;
