import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GoPersonFill } from "react-icons/go";


const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [buildings, setBuildings] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [addOwner, setAddOwner] = useState("");
  const [owner_name, setOwnerName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make the API call to add a new owner
    axios.post('http://localhost:3001/add-owner', { owner_name })
      .then((res) => {
        console.log(res);
        alert("Owner added successfully");
        setAddOwner(false);
        fetchOwners();
      })
      .catch((err) => {
        console.error("Error adding owner:", err);
        alert("Failed to add owner");
      });
  };


  // Fetch owners
  const fetchOwners = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/owners");
      setOwners(data);
    } catch (error) {
      console.error("Error fetching owners:", error);
    }
  }, []);

   useEffect(() => {
    fetchOwners();
   }, [fetchOwners]);
  
  
  

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

   const handleEdit = (id, currentName) => {
  setEditId(id);
  setEditName(currentName);
  };
  
  const handleSaveEdit = (e) => {
  e.preventDefault();

  if (!editName) {
    alert("Name cannot be empty");
    return;
  }

  axios
    .put(`http://localhost:3001/owners/${editId}`, { owner_name: editName })
    .then(() => {
      alert("Owner updated successfully");
      setOwners((prev) =>
        prev.map((owner) =>
          owner._id === editId ? { ...owner, owner_name: editName } : owner
        )
      );
      setEditId(null);
    })
    .catch((err) => {
      console.error("Error updating owner:", err);
      alert("Failed to update owner");
    });
};

  const handleBuildingSearch = (id) => {
    setBuildings([]);
    setSelectedOwner(owners.find((owner) => owner._id === id));

    axios
      .get(`http://localhost:3001/owners/${id}/buildings`)
      .then((res) => {
        setBuildings(res.data); // Assuming res.data contains building details
        setFormVisible(true);
      })
      .catch((err) => {
        console.error("Error fetching buildings:", err);
        alert("Failed to fetch buildings.");
      });
  };

  const filteredOwners = owners.filter((owner) =>
  owner.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOwners = filteredOwners.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (addOwner) {
    return (
      <div className='AddAdminHome'>
        <div className="AddAdminWrapper">
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
                <GoPersonFill className='icon' />
              </div>
              <button type="submit" className="AddAdminBtn">Add Owner</button>
            </form>
            <button className="AddAdminBtn " style={{width: "55%"}} onClick={() => setAddOwner(false)} > Back to Owners </button>
          </div>
        </div>
      </div>
    );
  }
  
  else if (editId) {
    return (
    <div className='AddAdminHome'>
        <div className="AddAdminWrapper" style={{height: "350px"}}>
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
                <button type="submit" className="AddAdminBtn">Save</button>
                <button type="button" className="AddAdminBtn " style={{width: "55%"}} onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </form>
          </div>
        </div>
        </div>
    );
  }
  
  else if (!addOwner) {
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
            <button className="submit-button" onClick={() => setFormVisible(false)}> Back to Owners </button>
          </>
        ) : (
          <>
            <h1 style={{marginTop: "30px"}}>Owners</h1>
            <div className="controls">
              <input type="text" className="form-control search-bar" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
              <button className="btn btn-primary add-button" onClick={() => { setAddOwner(true); }}> <FaPlus /></button>
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
                        <button className="view-button" onClick={() => handleBuildingSearch(owner._id)}> <FaEye /> View Buildings</button>
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
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(filteredOwners.length / itemsPerPage) },
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
  }
};

export default Owners;
