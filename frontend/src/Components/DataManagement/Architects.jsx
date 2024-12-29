import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import "./DataPage.css";
import AddArchitect from "./AddArchitect";

const Architects = () => {
  const [architects, setArchitects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [buildings, setBuildings] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedArchitect, setSelectedArchitect] = useState(null);

  const [showAddArchitect, setShowAddArchitect] = useState(false);

  const ShowAddArchitects = () => {
    setShowAddArchitect(true);
  };

  // Fetch architects on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3001/architects") // Adjust URL if needed
      .then((res) => {
        setArchitects(res.data);
      })
      .catch((err) => {
        console.error("Error fetching Architects:", err);
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

  const handleEdit = (id) => {
    const newName = prompt("Enter new name:");
    if (newName) {
      axios
        .put(`http://localhost:3001/architects/${id}`, { name: newName })
        .then(() => {
          alert("Architect updated successfully");
          setArchitects((prev) =>
            prev.map((architect) =>
              architect._id === id ? { ...architect, name: newName } : architect
            )
          );
        })
        .catch((err) => {
          console.error("Error updating architect:", err);
          alert("Failed to update architect");
        });
    }
  };

  const handleBuildingSearch = (id) => {
    setBuildings([]);
    setSelectedArchitect(architects.find((architect) => architect._id === id));

    axios
      .get(`http://localhost:3001/architects/${id}/buildings`)
      .then((res) => {
        setBuildings(res.data); // Assuming res.data contains building details
        setFormVisible(true);
      })
      .catch((err) => {
        console.error("Error fetching buildings:", err);
        alert("Failed to fetch buildings.");
      });
  };

  const filteredArchitects = architects.filter((architect) =>
    Object.values(architect)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArchitects = filteredArchitects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (showAddArchitect) {
    return (
      <div className="table-container">
        {showAddArchitect && <AddArchitect />}
      </div>
    );
  }

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
          <button
            className="submit-button"
            onClick={() => setFormVisible(false)}
          >
            Back to Architects
          </button>
        </>
      ) : (
        <>
          <h1>Architects</h1>
          <div className="controls">
            <input
              type="text"
              className="form-control search-bar"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              className="btn btn-primary add-button"
              onClick={() => {
                ShowAddArchitects();
              }}
            >
              <FaPlus />
            </button>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>
                  <AiOutlineFieldNumber />
                </th>
                <th onClick={() => handleSort("architect_name")}>
                  Architect Name <BiSortAlt2 />
                </th>

                <th onClick={() => handleSort("en_biography")}>
                  English Biography <BiSortAlt2 />
                </th>        
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentArchitects.length > 0 ? (
                currentArchitects.map((architect, index) => (
                  <tr key={architect._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                        <td>{architect.architect_name}</td>
                        <td>{architect.en_biography}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(architect._id)}
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
                  <td colSpan="3">No architects found.</td>
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
                  className={`page-button ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
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
};

export default Architects;
