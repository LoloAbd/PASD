import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ThsLink = () => {
  const [buildings, setBuildings] = useState([]);
  const [building_id, setBuildingId] = useState("");
  const [thsLink, setThsLink] = useState("");
  const navigate = useNavigate();

  // Fetch buildings data
  useEffect(() => {
    axios
      .get("http://localhost:3001/get-buildings")
      .then((res) => setBuildings(res.data))
      .catch((err) => console.error("Error fetching buildings:", err));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
      e.preventDefault();

      const updatedData = {
      thsLink: thsLink,
    };
      
    try {
      await axios.put(`http://localhost:3001/buildingsThs/${building_id}`, updatedData);
      setBuildings((prev) =>
        prev.map((building) =>
          building._id === building_id ? { ...building, ...updatedData } : building
        )
      );
      alert("building updated successfully!");
        navigate("/")
    } catch (err) {
      console.error("Error updating building:", err);
      alert("Failed to update building. Please try again.");
      }
      
  };

  return (
    <div className="BuildingImagesWrapper">
      <div className="BuildingImagesBox">
        <h2 className="BuildingImagesTitle">360 Degree Link</h2>
        <form id="uploadForm" onSubmit={handleSubmit}>
          <div className="form-column">
            <div className="InputGroup">
              <label htmlFor="building_id">Building Name</label>
              <select
                id="building_id"
                value={building_id}
                onChange={(e) => setBuildingId(e.target.value)}
                required
              >
                <option value="">Select Building</option>
                {buildings.map((building) => (
                  <option key={building._id} value={building._id}>
                    {building.building_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="InputGroup">
              <label htmlFor="thsLink">Building 360 Link</label>
              <input
                id="thsLink"
                value={thsLink}
                onChange={(e) => setThsLink(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="BuildingImagesBtn"  style={{ width: "200px", display: "block", margin: "0 auto" }}>
                Submit
            </button>

                      
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThsLink;