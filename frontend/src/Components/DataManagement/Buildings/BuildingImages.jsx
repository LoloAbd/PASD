import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BuildingImages.css";
import logAction from "../../logAction";

const options = [
  { value: "frontImage", label: "Front Image" },
  { value: "drawing", label: "Drawing" },
  { value: "sitePlan", label: "Site plan" },
  { value: "floorPlan", label: "Floor Plan" },
  { value: "groundFloor", label: "Ground Floor" },
  { value: "sections", label: "Section" },
  { value: "elevations", label: "Elevation" },
  { value: "photo", label: "Photo" },
];

const BuildingImages = () => {
  const [buildings, setBuildings] = useState([]);
  const [building_id, setBuildingId] = useState("");
  const [description, setDescription] = useState("");
  const [filename, setImageUrl] = useState(""); // Changed from file to URL
  const [referenceType, setReferenceType] = useState("ownedByPASD");
  const [pictureReference, setPictureReference] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [number, setNumber] = useState("");
  const navigate = useNavigate();

  // Fetch buildings data
  useEffect(() => {
    axios
      .get("http://localhost:3001/get-buildings")
      .then((res) => setBuildings(res.data))
      .catch((err) => console.error("Error fetching buildings:", err));
  }, []);

  // Handle form submission
  const handleSubmit = async (e, action) => {
    e.preventDefault();

    if (!filename) {
      alert("Please provide an image URL.");
      return;
    }

    // Combine selectedOption and number (if applicable)
    const typeWithNumber =
      selectedOption && number
        ? `${selectedOption.label} ${number}`
        : selectedOption?.label || "";

    const payload = {
      building_id,
      Type: typeWithNumber,
      description,
      referenceType,
      pictureReference,
      filename, // Send the image URL instead of a file
    };

    try {
      await axios.post("http://localhost:3001/add-images", payload);

      alert("Image added successfully!");
      // Find the selected building name from the building_id
      const selectedBuilding = buildings.find((b) => b._id === building_id);
      logAction("Add Building image", selectedBuilding.building_name);

      if (action === "submit") {
        navigate("/");
      } else {
        // Reset form fields
        setDescription("");
        setImageUrl("");
        setSelectedOption(null);
        setNumber("");
        setPictureReference("");
      }
    } catch (error) {
      console.error("Error adding image:", error);
      alert(`Failed to add image. ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="BuildingImagesWrapper">
      <div className="BuildingImagesBox">
        <h2 className="BuildingImagesTitle">Add Images</h2>
        <form id="uploadForm" onSubmit={(e) => handleSubmit(e, "addAnother")}>
          <div className="form-columns">
            {/* Left Column */}
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
                <Select
                  options={options}
                  value={selectedOption}
                  onChange={(selected) => {
                    setSelectedOption(selected);
                    setNumber("");
                  }}
                  placeholder="Choose Image Type"
                  className="react-select"
                  classNamePrefix="react-select"
                />
                {selectedOption &&
                  (selectedOption.value === "drawing" ||
                    selectedOption.value === "photo" ||
                    selectedOption.value === "floorPlan" ||
                    selectedOption.value === "sections" ||
                    selectedOption.value === "elevations") && (
                    <input
                      type="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      min="1"
                      placeholder={`Enter ${selectedOption.label.toLowerCase()} number`}
                      required
                    />
                  )}
              </div>

              <div className="InputGroup">
                <label htmlFor="description">Image Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="InputGroup">
                <label htmlFor="filename">Image URL</label>
                <input
                  type="url"
                  id="filename"
                  value={filename}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  required
                />
              </div>

              <div className="radio-container">
                <label>
                  <input
                    type="radio"
                    value="ownedByPASD"
                    checked={referenceType === "ownedByPASD"}
                    onChange={(e) => setReferenceType(e.target.value)}
                  />
                  Owned By PASD
                </label>
                <label>
                  <input
                    type="radio"
                    value="pictureReference"
                    checked={referenceType === "pictureReference"}
                    onChange={(e) => setReferenceType(e.target.value)}
                  />
                  Picture Reference
                </label>
              </div>

              {referenceType === "pictureReference" && (
                <input
                  type="text"
                  value={pictureReference}
                  onChange={(e) => setPictureReference(e.target.value)}
                  placeholder="Enter picture reference"
                  className="reference-input"
                  required
                />
              )}

              {/* Buttons */}
              <div className="button-container">
                <button type="button" 
                  onClick={(e) => handleSubmit(e, "button")}
                  className="BuildingImagesBtn">
                  Add Another Image
                </button>
                <button
                  type="submit"
                  onClick={(e) => handleSubmit(e, "submit")}
                  className="BuildingImagesBtn"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuildingImages;