import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import './DataPage.css';

import { useNavigate } from "react-router-dom";

const Architects = () => {
  const navigate = useNavigate();
  const [architects, setArchitects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [buildings, setBuildings] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedArchitect, setSelectedArchitect] = useState(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEnBio, setEditEnBio] = useState("");
  const [editId, setEditId] = useState(null);

   const AddArchitects = () => {
    navigate('/AddArchitects');
  };

  // Fetch architects on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3001/architects")
      .then((res) => {
        setArchitects(res.data);
      })
      .catch((err) => {
        console.error("Error fetching architects:", err);
      });
  }, []);

  const handleSort = (columnName) => {
    const direction =
      sortConfig.key === columnName && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnName, direction });

    const sortedData = [...architects].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setArchitects(sortedData);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (architect) => {
    setEditName(architect.architect_name);
    setEditEnBio(architect.biography);
    setEditId(architect._id);
    setIsEditFormVisible(true);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    if (!editName || !editEnBio) {
      alert("Please fill out all required fields.");
      return;
    }

    const updatedData = {
      architect_name: editName,
      biography: editEnBio,
    };

    axios
      .put(`http://localhost:3001/architects/${editId}`, updatedData)
      .then((response) => {
        alert("Architect updated successfully!");
        setArchitects((prev) =>
          prev.map((architect) =>
            architect._id === editId ? { ...architect, ...updatedData } : architect
          )
        );
        setIsEditFormVisible(false);
        setEditId(null);
      })
      .catch((err) => {
        if (err.response) {
          console.error("Response Error:", err.response.data);
        } else if (err.request) {
          console.error("Request Error:", err.request);
        } else {
          console.error("General Error:", err.message);
        }
      });
  };

  const handleBuildingSearch = (id) => {
    setBuildings([]);
    setSelectedArchitect(architects.find((architect) => architect._id === id));

    axios
      .get(`http://localhost:3001/architects/${id}/buildings`)
      .then((res) => {
        setBuildings(res.data);
        setFormVisible(true);
      })
      .catch((err) => {
        console.error("Error fetching buildings:", err);
        alert("Failed to fetch buildings.");
      });
  };

  const filteredArchitects = architects.filter((architect) =>
    architect.architect_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArchitects = filteredArchitects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isEditFormVisible) {
    return (
      <div className="table-container">
        <div className="AddAdminWrapper" style={{ height: "550px" }}>
          <div className="AddAdminFormBox">
            <h2 className="AddAdminTitle">Edit Architect</h2>
            <form>
              <div className="AddAdminInputBox">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <label>Architect Name:</label>
              </div>
              <label className="add-building-label">Biography</label>
              <div className="form-group">
                <textarea value={editEnBio} onChange={(e) => setEditEnBio(e.target.value)} />
              </div>
              <button type="button" className="AddAdminBtn" style={{ width: "170px", marginTop: "30px" }} onClick={handleSaveChanges}>
                Save Changes
              </button>
              <button className="AddAdminBtn" style={{ width: "100px" }} onClick={() => setIsEditFormVisible(false)}>
                Cancel
              </button>

            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="table-container">
        {formVisible ? (
          <>
            <h1>Buildings Related to Architect: {selectedArchitect?.architect_name}</h1>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>
                    <AiOutlineFieldNumber />
                  </th>
                  <th>
                    Building Name <BiSortAlt2 />
                  </th>
                </tr>
              </thead>
              <tbody>
                {buildings.length > 0 ? (
                  buildings.map((building, index) => (
                    <tr key={building.building_id}>
                      <td>{index + 1}</td>
                      <td>{building.building_name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No buildings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button className="submit-button" onClick={() => setFormVisible(false)}>Back to Architects</button>
          </>
        ) : (
          <>
            <h1>Architects</h1>
            <div className="controls">
                <input type="text" className="form-control search-bar" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                <button className="btn btn-primary add-button" onClick={AddArchitects}> <FaPlus /></button>
            </div>
            <table className="custom-table" style={{ width: "1000px" }}>
              <thead>
                <tr>
                  <th>
                    <AiOutlineFieldNumber />
                  </th>
                  <th onClick={() => handleSort("architect_name")}>Architect Name <BiSortAlt2 /></th>
                  <th onClick={() => handleSort("biography")}>Biography <BiSortAlt2 /></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentArchitects.length > 0 ? (
                  currentArchitects.map((architect, index) => (
                    <tr key={architect._id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{architect.architect_name}</td>
                      <td>{architect.biography}</td>
                      <td>
                        <button className="edit-button" onClick={() => handleEdit(architect)}><FaEdit /></button>
                        <button className="view-button" onClick={() => handleBuildingSearch(architect._id)}> <FaEye /> View Buildings</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No architects found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(filteredArchitects.length / itemsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
    );
  }
};

export default Architects;
