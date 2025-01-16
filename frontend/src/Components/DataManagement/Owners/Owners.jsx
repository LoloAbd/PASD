import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaEye} from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GoPersonFill } from "react-icons/go";
import logAction from "../../logAction";
import Pagination from "../../Pagination"; // Reusable Pagination Component

const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [buildings, setBuildings] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [addOwner, setAddOwner] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // Fetch owners
  const fetchOwners = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/owners");
      setOwners(data);
    } catch (error) {
      console.error("Error fetching owners:", error);
      alert("Failed to fetch owners. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  // Handle sorting
  const handleSort = (columnName) => {
    const direction =
      sortConfig.key === columnName && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnName, direction });

    const sortedData = [...owners].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setOwners(sortedData);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle add owner
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/add-owner", {
        owner_name: ownerName,
      });
      console.log(res);
      alert("Owner added successfully");
      setAddOwner(false);
      fetchOwners();
      logAction("Add Owner", ownerName);
    } catch (err) {
      console.error("Error adding owner:", err);
      alert("Failed to add owner. Please try again.");
    }
  };

  // Handle edit owner
  const handleEdit = (id, currentName) => {
    setEditId(id);
    setEditName(currentName);
  };

  // Handle save edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editName) {
      alert("Name cannot be empty");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/owners/${editId}`, {
        owner_name: editName,
      });
      alert("Owner updated successfully");
      setOwners((prev) =>
        prev.map((owner) =>
          owner._id === editId ? { ...owner, owner_name: editName } : owner
        )
      );
      setEditId(null);
      logAction("Edit Owner", editName);
    } catch (err) {
      console.error("Error updating owner:", err);
      alert("Failed to update owner. Please try again.");
    }
  };

  // Handle building search
  const handleBuildingSearch = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/owners/${id}/buildings`);
      setBuildings(res.data);
      setSelectedOwner(owners.find((owner) => owner._id === id));
      setFormVisible(true);
    } catch (err) {
      console.error("Error fetching buildings:", err);
      alert("Failed to fetch buildings. Please try again.");
    }
  };

  // Filter owners based on search term
  const filteredOwners = owners.filter((owner) =>
    owner.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOwners = filteredOwners.slice(indexOfFirstItem, indexOfLastItem);

  if (addOwner) {
    return (
      <div className="AddAdminHome">
        <div className="AddAdminWrapper" style={{ height: "400px" }}>
          <div className="AddAdminFormBox">
            <h2 className="AddAdminTitle">Add New Owner</h2>
            <form onSubmit={handleSubmit}>
              <div className="AddAdminInputBox">
                <input
                  type="text"
                  name="owner_name"
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
                <label>Owner Name</label>
                <GoPersonFill className="icon" />
              </div>
              <button type="submit" className="AddAdminBtn">
                Add Owner
              </button>
            </form>
            <button
              className="AddAdminBtn"
              style={{ width: "55%" }}
              onClick={() => setAddOwner(false)}
            >
              Back to Owners
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (editId) {
    return (
      <div className="AddAdminHome">
        <div className="AddAdminWrapper" style={{ height: "350px" }}>
          <div className="AddAdminFormBox">
            <h2 className="AddAdminTitle">Edit Owner Name:</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="AddAdminInputBox">
                <input
                  type="text"
                  id="owner_name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <button type="submit" className="AddAdminBtn">
                Save
              </button>
              <button
                type="button"
                className="AddAdminBtn"
                style={{ width: "55%" }}
                onClick={() => setEditId(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      {formVisible ? (
        <>
          <h1>Buildings Related to Owner: {selectedOwner?.owner_name}</h1>
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
          <button className="submit-button" onClick={() => setFormVisible(false)}>
            Back to Owners
          </button>
        </>
      ) : (
        <>
          <h1 style={{ marginTop: "30px" }}>Owners</h1>
          <div className="controls">
            <input
              type="text"
              className="form-control search-bar"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="btn btn-primary add-button" onClick={() => setAddOwner(true)}>+ </button>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>
                  <AiOutlineFieldNumber />
                </th>
                <th onClick={() => handleSort("owner_name")}>
                  Owner Name <BiSortAlt2 />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOwners.length > 0 ? (
                currentOwners.map((owner, index) => (
                  <tr key={owner._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{owner.owner_name}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(owner._id, owner.owner_name)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="view-button"
                        onClick={() => handleBuildingSearch(owner._id)}
                      >
                        <FaEye /> View Buildings
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No owners found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredOwners.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Owners;