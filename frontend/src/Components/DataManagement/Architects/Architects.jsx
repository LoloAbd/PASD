import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaEye} from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import Pagination from "../../Pagination";
import logAction from "../../logAction";
import "./DataPage.css";
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
  const [editArBio, setEditArBio] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch architects on component mount
  useEffect(() => {
    const fetchArchitects = async () => {
      try {
        const res = await axios.get("http://localhost:3001/architects");
        setArchitects(res.data);
      } catch (err) {
        console.error("Error fetching architects:", err);
        alert("Failed to fetch architects. Please try again.");
      }
    };
    fetchArchitects();
  }, []);

  // Handle sorting
  const handleSort = (columnName) => {
    // Determine the new sort direction based on current sort configuration
    const direction =
      sortConfig.key === columnName && sortConfig.direction === "asc"
        ? "desc" // If the column is already sorted in ascending order, switch to descending
        : "asc";  // Otherwise, sort in ascending order

    // Update the sorting configuration (key and direction)
    setSortConfig({ key: columnName, direction });

    // Create a new sorted array based on the chosen column
    const sortedData = [...architects].sort((a, b) => {
      // Compare values of the chosen column for sorting (in ascending or descending order)
      // If the direction is ascending ("asc"), return -1 to place a before b in the sorted array
      // If the direction is descending ("desc"), return 1 to place b before a in the sorted array
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;

      // If the values are equal, return 0 (no change in order)
      return 0;
    });

    // Update the state with the sorted data
    setArchitects(sortedData);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle edit architect
  const handleEdit = (architect) => {
    setEditName(architect.architect_name);
    setEditEnBio(architect.en_biography);
    setEditArBio(architect.ar_biography);
    setEditId(architect._id);
    setIsEditFormVisible(true);
  };

  // Handle save changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const updatedData = {
      architect_name: editName,
      en_biography: editEnBio,
      ar_biography: editArBio,
    };

    try {
      await axios.put(`http://localhost:3001/architects/${editId}`, updatedData);
      setArchitects((prev) =>
        prev.map((architect) =>
          architect._id === editId ? { ...architect, ...updatedData } : architect
        )
      );
      alert("Architect updated successfully!");
      logAction("Edit Architect", editName);
      setIsEditFormVisible(false);
    } catch (err) {
      console.error("Error updating architect:", err);
      alert("Failed to update architect. Please try again.");
    }
  };

  // Handle building search
  const handleBuildingSearch = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/architects/${id}/buildings`);
      setBuildings(res.data);
      setSelectedArchitect(architects.find((architect) => architect._id === id));
      setFormVisible(true);
    } catch (err) {
      console.error("Error fetching buildings:", err);
      alert("Failed to fetch buildings.");
    }
  };

  // Filter architects based on search term
  const filteredArchitects = architects.filter((architect) =>
    architect.architect_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArchitects = filteredArchitects.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="table-container">
      {isEditFormVisible ? (
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
              <label className="add-building-label">Arabic Biography</label>
              <div className="form-group">
                <textarea
                  value={editArBio}
                  onChange={(e) => setEditArBio(e.target.value)}
                />
              </div>
              <label className="add-building-label">English Biography</label>
              <div className="form-group">
                <textarea
                  value={editEnBio}
                  onChange={(e) => setEditEnBio(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="AddAdminBtn"
                style={{ width: "170px", marginTop: "30px" }}
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                className="AddAdminBtn"
                style={{ width: "100px" }}
                onClick={() => setIsEditFormVisible(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      ) : formVisible ? (
        <>
          <h1>Buildings Related to Architect: {selectedArchitect?.architect_name}</h1>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: "70px" }}><AiOutlineFieldNumber /></th>
                <th>Building Name <BiSortAlt2 /></th>
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
          <button className="submit-button" onClick={() => setFormVisible(false)}>
            Back to Architects
          </button>
        </>
      ) : (
        <>
          <h1 style={{ marginTop: "40px" }}>Architects</h1>
          <div className="controls">
            <input
              type="text"
              className="form-control search-bar"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="btn btn-primary add-button" onClick={() => navigate("/AddArchitects")}  >+</button>
          </div>
          <table className="custom-table" style={{ width: "1000px" }}>
            <thead>
              <tr>
                <th style={{ width: "70px" }}><AiOutlineFieldNumber /></th>
                <th onClick={() => handleSort("architect_name")}>Architect Name <BiSortAlt2 /></th>
                <th onClick={() => handleSort("en_biography")} style={{ width: "550px" }}>English Biography <BiSortAlt2 /></th>
                <th style={{ width: "250px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentArchitects.length > 0 ? (
                currentArchitects.map((architect, index) => (
                  <tr key={architect._id}>
                    <td >{indexOfFirstItem + index + 1}</td>
                    <td>{architect.architect_name}</td>
                    <td>{architect.en_biography}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(architect)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="view-button"
                        onClick={() => handleBuildingSearch(architect._id)}
                      >
                        <FaEye /> View Buildings
                      </button>
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
          <Pagination
            currentPage={currentPage}
            totalItems={filteredArchitects.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Architects;