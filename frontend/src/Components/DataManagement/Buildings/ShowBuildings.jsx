import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const ShowBuildings = () => {
  const navigate = useNavigate();

  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [buildingData, setBuildingData] = useState({
    buildings: [],
    addresses: [],
    cities: [],
  });
  const [status, setStatus] = useState([]);
  const [usage, setUsage] = useState([]);
  const [formVisible, setFormVisible] = useState(1); // 1: Buildings, 2: Status, 3: Usage
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buildingsRes, addressesRes, citiesRes] = await Promise.all([
          axios.get("http://localhost:3001/get-buildings"),
          axios.get("http://localhost:3001/get-addresses"),
          axios.get("http://localhost:3001/get-cities"),
        ]);
        setBuildingData({
          buildings: buildingsRes.data,
          addresses: addressesRes.data,
          cities: citiesRes.data,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Handle sorting
  const handleSort = (columnName) => {
    const direction =
      sortConfig.key === columnName && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnName, direction });

    const sortedData = [...buildingData.buildings].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setBuildingData((prev) => ({ ...prev, buildings: sortedData }));
  };

  // Handle search
  const handleSearch = (e) => setSearchTerm(e.target.value);

  // Filter buildings based on search term
  const filteredBuildings = buildingData.buildings.filter((building) =>
    Object.values(building).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBuildings = filteredBuildings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
 
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navigate to AddBuilding page
  const AddBuilding = () => navigate("/AddBuildings");

  // Fetch status for a specific building
  const handleStatusSearch = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/buildings/${id}/status`);
      setStatus(res.data);
      setSelectedBuilding(buildingData.buildings.find((b) => b._id === id));
      setFormVisible(2);
    } catch (err) {
      console.error("Error fetching status:", err);
      alert("Failed to fetch status.");
    }
  };

  // Fetch usage for a specific building
  const handleUsageSearch = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/buildings/${id}/usage`);
      setUsage(res.data);
      setSelectedBuilding(buildingData.buildings.find((b) => b._id === id));
      setFormVisible(3);
    } catch (err) {
      console.error("Error fetching usage:", err);
      alert("Failed to fetch usage.");
    }
  };

  // Render status table
  const renderStatusTable = () => (
    <>
      <h1 className="relatedHead">Status Related to: {selectedBuilding?.building_name}</h1>
      <table className="custom-table" style={{ width: "600px" }}>
        <thead>
          <tr>
            <th>
              <AiOutlineFieldNumber />
            </th>
            <th style={{ width: "500px" }}>Status Name</th>
          </tr>
        </thead>
        <tbody>
          {status.length > 0 ? (
            status.map((statusItem, index) => (
              <tr key={statusItem.status_id}>
                <td>{index + 1}</td>
                <td >{statusItem.status_name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No Status found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="submit-button" onClick={() => setFormVisible(1)}>
        Back to Buildings
      </button>
    </>
  );

  // Render usage table
  const renderUsageTable = () => (
    <>
      <h1 className="relatedHead">Usage Related to: {selectedBuilding?.building_name}</h1>
      <table className="custom-table">
        <thead>
          <tr>
            <th>
              <AiOutlineFieldNumber />
            </th>
            <th>Usage Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {usage.length > 0 ? (
            usage.map((usageItem, index) => (
              <tr key={usageItem.usage_id}>
                <td>{index + 1}</td>
                <td>{usageItem.usage_name}</td>
                <td>{usageItem.type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No Usage found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="submit-button" onClick={() => setFormVisible(1)}>
        Back to Buildings
      </button>
    </>
  );

  // Render buildings table
  const renderBuildingsTable = () => (
    <>
      <h1 style={{ marginTop: "40px" }}>Buildings</h1>
      <div className="controls">
        <input
          type="text"
          className="form-control search-bar"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="btn btn-primary add-button" onClick={AddBuilding}>+</button>
      </div>
      <table className="custom-table"  style={{ width: "1400px" }}>
        <thead>
          <tr>
            <th>
              <AiOutlineFieldNumber />
            </th>
            <th onClick={() => handleSort("building_name")}>
              Building Name <BiSortAlt2 />
            </th>
            <th onClick={() => handleSort("documentationDate")}>
              Documentation Date <BiSortAlt2 />
            </th>
            <th>Status</th>
            <th>Usages</th>
            <th>Street</th>
            <th>City</th>
            <th style={{ width: "400px" }}>360 View Link</th>
          </tr>
        </thead>
        <tbody>
          {currentBuildings.length > 0 ? (
            currentBuildings.map((building, index) => (
              <tr key={building._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{building.building_name}</td>
                <td>{building.documentationDate}</td>
                <td>
                  <button
                    className="view-button"
                    onClick={() => handleStatusSearch(building._id)}
                  >
                    <FaEye />
                  </button>
                </td>
                <td>
                  <button
                    className="view-button"
                    onClick={() => handleUsageSearch(building._id)}
                  >
                    <FaEye />
                  </button>
                </td>
                <td>
                  {buildingData.addresses.find(
                    (address) => address._id === building.address_id
                  )?.street || "Unknown"}
                </td>
                <td>
                  {(() => {
                    const address = buildingData.addresses.find(
                      (address) => address._id === building.address_id
                    );
                    return (
                      buildingData.cities.find(
                        (city) => city._id === address?.city_id
                      )?.city_name || "Unknown"
                    );
                  })()}
                </td>
                <td>{building.thsLink}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No Buildings found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredBuildings.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
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
  );

  return (
    <div className="table-container">
      {formVisible === 2 && renderStatusTable()}
      {formVisible === 3 && renderUsageTable()}
      {formVisible === 1 && renderBuildingsTable()}
    </div>
  );
};

export default ShowBuildings;