import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaEye } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GoPersonFill } from "react-icons/go";
import logAction from "../../logAction";
import Pagination from "../../Pagination"; // Reusable Pagination Component

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [buildings, setBuildings] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [addTenant, setAddTenant] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // Fetch tenants
  const fetchTenants = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/tenants");
      setTenants(data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      alert("Failed to fetch tenants. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  // Handle sorting
  const handleSort = (columnName) => {
    const direction =
      sortConfig.key === columnName && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnName, direction });

    const sortedData = [...tenants].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setTenants(sortedData);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle add tenant
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/add-tenant", {
        tenant_name: tenantName,
      });
      console.log(res);
      alert("Tenant added successfully");
      setAddTenant(false);
      fetchTenants();
      logAction("Add Tenant", tenantName);
    } catch (err) {
      console.error("Error adding tenant:", err);
      alert("Failed to add tenant. Please try again.");
    }
  };

  // Handle edit tenant
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
      await axios.put(`http://localhost:3001/tenants/${editId}`, {
        tenant_name: editName,
      });
      alert("Tenant updated successfully");
      setTenants((prev) =>
        prev.map((tenant) =>
          tenant._id === editId ? { ...tenant, tenant_name: editName } : tenant
        )
      );
      setEditId(null);
      logAction("Edit Tenant", editName);
    } catch (err) {
      console.error("Error updating tenant:", err);
      alert("Failed to update tenant. Please try again.");
    }
  };

  // Handle building search
  const handleBuildingSearch = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/tenants/${id}/buildings`);
      setBuildings(res.data);
      setSelectedTenant(tenants.find((tenant) => tenant._id === id));
      setFormVisible(true);
    } catch (err) {
      console.error("Error fetching buildings:", err);
      alert("Failed to fetch buildings. Please try again.");
    }
  };

  // Filter tenants based on search term
  const filteredTenants = tenants.filter((tenant) =>
    tenant.tenant_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTenants = filteredTenants.slice(indexOfFirstItem, indexOfLastItem);

  if (addTenant) {
    return (
      <div className="AddAdminHome">
        <div className="AddAdminWrapper" style={{ height: "400px" }}>
          <div className="AddAdminFormBox">
            <h2 className="AddAdminTitle">Add New Tenant</h2>
            <form onSubmit={handleSubmit}>
              <div className="AddAdminInputBox">
                <input
                  type="text"
                  name="tenantName"
                  onChange={(e) => setTenantName(e.target.value)}
                  required
                />
                <label>Tenant Name</label>
                <GoPersonFill className="icon" />
              </div>
              <button type="submit" className="AddAdminBtn">
                Add Tenant
              </button>
            </form>
            <button
              className="AddAdminBtn"
              style={{ width: "55%" }}
              onClick={() => setAddTenant(false)}
            >
              Back to Tenants
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
            <h2 className="AddAdminTitle">Edit Tenant Name:</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="AddAdminInputBox">
                <input
                  type="text"
                  id="tenant-name"
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
          <h1>Buildings Related to Tenant: {selectedTenant?.tenant_name}</h1>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: "70px" }}>
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
            Back to Tenants
          </button>
        </>
      ) : (
        <>
          <h1 style={{ marginTop: "30px" }}>Tenants</h1>
          <div className="controls">
            <input
              type="text"
              className="form-control search-bar"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="btn btn-primary add-button" onClick={() => setAddTenant(true)}>+</button>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: "70px" }}>
                  <AiOutlineFieldNumber />
                </th>
                <th onClick={() => handleSort("tenant_name")}>
                  Tenant Name <BiSortAlt2 />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTenants.length > 0 ? (
                currentTenants.map((tenant, index) => (
                  <tr key={tenant._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{tenant.tenant_name}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(tenant._id, tenant.tenant_name)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="view-button"
                        onClick={() => handleBuildingSearch(tenant._id)}
                      >
                        <FaEye /> View Buildings
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No tenants found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredTenants.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Tenants;