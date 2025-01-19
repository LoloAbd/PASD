import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { FaLocationDot, FaTreeCity } from "react-icons/fa6";
import { FaEye} from "react-icons/fa";

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
  const [mapFile, setMapFile] = useState(null);

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

  if (!city_name || !country_id) {
    alert("Please fill out all required fields.");
    return;
  }

  const formData = new FormData();
  formData.append("city_name", city_name);
  formData.append("country_id", country_id);
  if (mapFile) {
    formData.append("map", mapFile);
  }

  try {
    const { data } = await axios.post("http://localhost:3001/add-cities", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("City and map added successfully!");
    setAddCity(false);
    fetchCities();
  } catch (error) {
    console.error("Error adding city with map:", error);
    alert("Failed to add city with map. Please try again.");
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
        <div className="AddAdminWrapper" style={{ height: "520px" }}>
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

              <div className="AddAdminInputBox">
                <input style={{marginTop: "15px"}}
                  type="file"
                  onChange={(e) => setMapFile(e.target.files[0])}
                />
                <label style={{marginTop: "10px"}}>Upload Map</label>
              </div>

              <button type="submit" className="AddAdminBtn"> Add City  </button>
              <button className="AddAdminBtn"  style={{ width: "55%" }}   onClick={() => setAddCity(false)}>Back to Cities </button>
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
          <button className="btn btn-primary add-button" onClick={() => setAddCity(true)}>+</button>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: "70px" }}>
                <AiOutlineFieldNumber />
              </th>
              <th onClick={() => handleSort("city_name")}>City Name <BiSortAlt2 /></th>
              <th onClick={() => handleSort("country_id")}>Country <BiSortAlt2 /></th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCities.length > 0 ? (
              currentCities.map((city, index) => (
                <tr key={city._id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{city.city_name}</td>
                  <td>{countries.find((country) => country._id === city.country_id)?.country_name || "Unknown"}</td>
                  <td>
            {city.map ? (
              city.map.contentType.startsWith("image/") ? (
                <img
                  src={`http://localhost:3001/cities/${city._id}/map`}
                  alt="City Map"
                  style={{ width: "100px", height: "100px" }}
                />
              ) : (
                <a
                  href={`http://localhost:3001/cities/${city._id}/map`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                 <button className="view-button"> <FaEye /> View Map</button> 
                </a>
              )
            ) : (
              <button className="view-button"> <FaEye /> View Map</button> 
            )}
          </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No cities found.</td>
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