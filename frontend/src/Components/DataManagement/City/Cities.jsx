import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { FaLocationDot, FaTreeCity } from "react-icons/fa6";
import { FaEye, FaMap, FaEdit, FaSave } from "react-icons/fa";

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [addCity, setAddCity] = useState(false);
  const [city_name, setCityName] = useState("");
  const [country_id, setCountryId] = useState("");
  const [mapUrl, setMapUrl] = useState(""); // Changed to handle URL instead of file
  const [editingCity, setEditingCity] = useState(null); // Track which city is being edited
  const [editCityName, setEditCityName] = useState(""); // State for editing city name
  const [editCountryId, setEditCountryId] = useState(""); // State for editing country ID
  const [editMapUrl, setEditMapUrl] = useState(""); // State for editing map URL

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

    if (!city_name || !country_id || !mapUrl) {
      alert("Please fill out all required fields.");
      return;
    }

    const newCity = {
      city_name,
      country_id,
      map: mapUrl, // Use the map URL
    };

    try {
      const { data } = await axios.post("http://localhost:3001/add-cities", newCity);
      alert("City added successfully!");
      setAddCity(false);
      fetchCities(); // Refresh the cities list
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
    setEditingCity(city._id); // Set the city ID being edited
    setEditCityName(city.city_name); // Set the current city name
    setEditCountryId(city.country_id); // Set the current country ID
    setEditMapUrl(city.map); // Set the current map URL
  };

  const handleSaveEdit = async (cityId) => {
    try {
      const updatedCity = {
        city_name: editCityName,
        country_id: editCountryId,
        map: editMapUrl, // Use the updated map URL
      };

      await axios.put(`http://localhost:3001/update-city/${cityId}`, updatedCity);

      alert("City updated successfully!");
      setEditingCity(null); // Exit edit mode
      fetchCities(); // Refresh the cities list
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (addCity) {
    return (
      <div className="AddAdminHome">
        <div className="AddAdminWrapper" style={{ height: "450px" }}>
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
                  type="text"
                  name="map"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  required
                />
                <label>Map URL</label>
                <FaMap className="icon" />
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
              <th>Map</th>
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
                        type="text"
                        value={editMapUrl}
                        onChange={(e) => setEditMapUrl(e.target.value)}
                      />
                    ) : (
                      city.map ? (
                        <a href={city.map} target="_blank" rel="noopener noreferrer">
                          <button className="view-button">
                            <FaEye /> View
                          </button>
                        </a>
                      ) : (
                        <button className="view-button">
                          <FaEye /> View
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
                <td colSpan="5">No cities found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(filteredCities.length / itemsPerPage) },
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
      </div>
    );
  }
};

export default Cities;