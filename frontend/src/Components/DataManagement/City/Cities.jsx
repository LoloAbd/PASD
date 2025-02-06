import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { FaLocationDot, FaTreeCity } from "react-icons/fa6";
import { FaEye, FaEdit, FaSave } from "react-icons/fa";
import logAction from "../../logAction";
import Pagination from "../../Pagination";

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [addCity, setAddCity] = useState(false);
  const [city_name, setCityName] = useState("");
  const [country_id, setCountryId] = useState("");
  const [roadFile, setRoadFile] = useState(null);
  const [buildingFile, setBuildingFile] = useState(null);
  const [borderFile, setBorderFile] = useState(null);
  const [editingCity, setEditingCity] = useState(null);
  const [editCityName, setEditCityName] = useState("");
  const [editCountryId, setEditCountryId] = useState("");
  const [editRoadFile, setEditRoadFile] = useState(null);
  const [editBuildingFile, setEditBuildingFile] = useState(null);
  const [editBorderFile, setEditBorderFile] = useState(null);

  const fetchCities = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/get-cities");
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/countries")
      .then((res) => {
        setCountries(res.data);
      })
      .catch((err) => {
        console.error("Error fetching countries:", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!city_name || !country_id || !roadFile || !buildingFile || !borderFile) {
      alert("Please fill out all required fields and upload all files.");
      return;
    }

    const formData = new FormData();
    formData.append("city_name", city_name);
    formData.append("country_id", country_id);
    formData.append("road", roadFile);
    formData.append("building", buildingFile);
    formData.append("border", borderFile);

    try {
      const { data } = await axios.post("http://localhost:3001/add-cities", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("City added successfully!");
      logAction("Add City", city_name);
      setAddCity(false);
      fetchCities();
    } catch (error) {
      console.error("Error adding city:", error);
      alert("Failed to add city. Please try again.");
    }
  };

  const handleSort = (columnName) => {
    const direction =
      sortConfig.key === columnName && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnName, direction });

    const sortedData = [...cities].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setCities(sortedData);
  };

  const handleEdit = (city) => {
    setEditingCity(city._id);
    setEditCityName(city.city_name);
    setEditCountryId(city.country_id);
    // Assuming the city object has road, building, and border fields
    setEditRoadFile(city.road);
    setEditBuildingFile(city.building);
    setEditBorderFile(city.border);
  };

  const handleSaveEdit = async (cityId) => {
    try {
      const formData = new FormData();
      formData.append("city_name", editCityName);
      formData.append("country_id", editCountryId);
      if (editRoadFile) formData.append("road", editRoadFile);
      if (editBuildingFile) formData.append("building", editBuildingFile);
      if (editBorderFile) formData.append("border", editBorderFile);

      await axios.put(`http://localhost:3001/update-city/${cityId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("City updated successfully!");
      logAction("Edit City", editCityName);
      setEditingCity(null);
      fetchCities();
    } catch (error) {
      console.error("Error updating city:", error);
      alert("Failed to update city. Please try again.");
    }
  };

  const filteredCities = cities.filter((city) =>
    city.city_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCities = filteredCities.slice(indexOfFirstItem, indexOfLastItem);

  if (addCity) {
    return (
      <div className="AddAdminHome">
        <div className="AddAdminWrapper">
          <div className="AddAdminFormBox">
            <h2 className="AddAdminTitle">Add New City</h2>
            <form onSubmit={handleSubmit}>
              <div className="AddAdminInputBox">
                <input
                  type="text"
                  name="city_name"
                  value={city_name}
                  onChange={(e) => setCityName(e.target.value)}
                  required
                />
                <label>City Name</label>
                <FaTreeCity className="icon" />
              </div>

              <div className="AddAdminInputBox">
                <input
                  type="file"
                  name="road"
                  onChange={(e) => setRoadFile(e.target.files[0])}
                  required
                />
                <label>Roads File</label>
              </div>

              <div className="AddAdminInputBox">
                <input
                  type="file"
                  name="building"
                  onChange={(e) => setBuildingFile(e.target.files[0])}
                  required
                />
                <label>Buildings File</label>
              </div>

              <div className="AddAdminInputBox">
                <input
                  type="file"
                  name="border"
                  onChange={(e) => setBorderFile(e.target.files[0])}
                  required
                />
                <label>Borders File</label>
              </div>

              <div className="AddAdminInputBox">
                <select
                  name="country_id"
                  value={country_id}
                  onChange={(e) => setCountryId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a Country
                  </option>
                  {countries.map((country) => (
                    <option key={country._id} value={country._id}>
                      {country.country_name}
                    </option>
                  ))}
                </select>
                <FaLocationDot className="icon" />
              </div>

              <button type="submit" className="AddAdminBtn">
                Add City
              </button>
              <button
                className="AddAdminBtn"
                style={{ width: "55%" }}
                onClick={() => setAddCity(false)}
              >
                Back to Cities
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="table-container">
        <h1 style={{ marginTop: "30px" }}>Cities</h1>
        <div className="controls">
          <input
            type="text"
            className="form-control search-bar"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary add-button" onClick={() => setAddCity(true)}>
            +
          </button>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: "70px" }}>
                <AiOutlineFieldNumber />
              </th>
              <th onClick={() => handleSort("city_name")}>City Name <BiSortAlt2 /></th>
              <th onClick={() => handleSort("country_id")}>Country <BiSortAlt2 /></th>
              <th>Road File</th>
              <th>Building File</th>
              <th>Border File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCities.length > 0 ? (
              currentCities.map((city, index) => (
                <tr key={city._id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>
                    {editingCity === city._id ? (
                      <input
                        type="text"
                        value={editCityName}
                        onChange={(e) => setEditCityName(e.target.value)}
                      />
                    ) : (
                      city.city_name
                    )}
                  </td>
                  <td>
                    {editingCity === city._id ? (
                      <select
                        value={editCountryId}
                        onChange={(e) => setEditCountryId(e.target.value)}
                      >
                        {countries.map((country) => (
                          <option key={country._id} value={country._id}>
                            {country.country_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      countries.find((country) => country._id === city.country_id)?.country_name || "Unknown"
                    )}
                  </td>
                  <td>
                    {editingCity === city._id ? (
                      <input
                        type="file"
                        onChange={(e) => setEditRoadFile(e.target.files[0])}
                      />
                    ) : (
                      city.road ? (
                        <a href={`http://localhost:3001/${city.road}`} target="_blank" rel="noopener noreferrer">
                          <button className="view-button">
                            <FaEye /> View
                          </button>
                        </a>
                      ) : (
                        <button className="view-button" disabled>
                          <FaEye /> No File
                        </button>
                      )
                    )}
                  </td>
                  <td>
                    {editingCity === city._id ? (
                      <input
                        type="file"
                        onChange={(e) => setEditBuildingFile(e.target.files[0])}
                      />
                    ) : (
                      city.building ? (
                        <a href={`http://localhost:3001/${city.building}`} target="_blank" rel="noopener noreferrer">
                          <button className="view-button">
                            <FaEye /> View
                          </button>
                        </a>
                      ) : (
                        <button className="view-button" disabled>
                          <FaEye /> No File
                        </button>
                      )
                    )}
                  </td>
                  <td>
                    {editingCity === city._id ? (
                      <input
                        type="file"
                        onChange={(e) => setEditBorderFile(e.target.files[0])}
                      />
                    ) : (
                      city.border ? (
                        <a href={`http://localhost:3001/${city.border}`} target="_blank" rel="noopener noreferrer">
                          <button className="view-button">
                            <FaEye /> View
                          </button>
                        </a>
                      ) : (
                        <button className="view-button" disabled>
                          <FaEye /> No File
                        </button>
                      )
                    )}
                  </td>
                  <td>
                    {editingCity === city._id ? (
                      <button
                        className="save-button"
                        onClick={() => handleSaveEdit(city._id)}
                      >
                        <FaSave /> Save
                      </button>
                    ) : (
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(city)}
                      >
                        <FaEdit /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No cities found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
            currentPage={currentPage}
            totalItems={filteredCities.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
      </div>
    );
  }
};

export default Cities;