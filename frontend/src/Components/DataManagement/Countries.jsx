import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import "./DataPage.css";

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
        // Fetch all admins from the server
        axios.get('http://localhost:3001/countries') // Adjust URL if needed
            .then(res => {
                setCountries(res.data); // Save the fetched data in the state
            })
            .catch(err => {
                console.error("Error fetching countries:", err);
            });
    }, []);

  const handleSort = (columnName) => {
    console.log("Sorting column:", columnName);
    let direction = "asc";
    if (sortConfig.key === columnName && sortConfig.direction === "asc") {
        direction = "desc";
    }
    setSortConfig({ key: columnName, direction });

    const sortedData = [...countries].sort((a, b) => {
        console.log("Comparing:", a[columnName], b[columnName]);
        if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
        if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
        return 0;
    });
    console.log("Sorted Data:", sortedData);
    setCountries(sortedData);
};

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const filteredCountries = countries.filter((owner) =>
    Object.values(owner).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = filteredCountries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="table-container">
      <h1>Countries</h1>
      
      <div className="controls">
        <input type="text" className="form-control search-bar" placeholder="Search..." value={searchTerm}  onChange={handleSearch} />
        <button className="btn btn-primary add-button"><FaPlus /> </button>
      </div>

      <table className="custom-table">
          <thead>
          <tr>
            <th><AiOutlineFieldNumber /></th>
            <th onClick={() => handleSort("_id")}>
              Country Id <span><BiSortAlt2 /></span>
            </th>
            <th onClick={() => handleSort("country_name")}>
              Country Name <span><BiSortAlt2 /></span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>

         <tbody>
          {countries.length > 0 ? (
            currentCountries.map((country, index) => (
              <tr key={country._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{country._id}</td>
                <td>{country.country_name}</td>
                <td>
                <button className="edit-button"><FaEdit /> </button>
                <button className="delete-button"><FaTrash /></button>
                </td>
              </tr>
            ))
            ) : (
            <tr>
            <td colSpan="4">No Countries found.</td>
            </tr>
            )}
        </tbody>

      </table>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredCountries.length / itemsPerPage) },
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

export default Countries;
