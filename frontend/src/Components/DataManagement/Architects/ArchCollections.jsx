import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logAction from "../../logAction";
import "./BuildingImages.css";

const ArchCollections = () => {
  const [architects, setArchitects] = useState([]);
  const [architect_id, setArchitectId] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImageUrl] = useState(""); // Renamed from filename to image_url
  const [referenceType, setReferenceType] = useState("ownedByPASD");
  const [pictureReference, setPictureReference] = useState("");
  const navigate = useNavigate();

  // Fetch architects on component mount
  useEffect(() => {
    const fetchArchitects = async () => {
      try {
        const res = await axios.get("http://localhost:3001/architects");
        setArchitects(res.data);
      } catch (err) {
        console.error("Error fetching architects:", err);
        alert("Failed to fetch architects. Please try again.");
      }
    };
    fetchArchitects();
  }, []);

  // Handle form submission
  const handleSubmit = async (e, action) => {
    e.preventDefault();

    if (!image_url) {
      alert("Please provide an image URL.");
      return;
    }

    const payload = {
      architect_id,
      description,
      image_url,
      referenceType,
      pictureReference,
    };

    try {
      await axios.post("http://localhost:3001/add-sketches", payload);

      alert("Sketch added successfully!");
      // Find the selected architect name from the architect_id
      const selectedArchitect = architects.find((a) => a._id === architect_id);
      if (selectedArchitect) {
        logAction("Add Architect Sketch", selectedArchitect.architect_name); // Assuming the architect object has a 'name' property
      }

      if (action === "submit") {
        navigate("/Architects");
      } else {
        // Reset form fields
        setDescription("");
        setImageUrl("");
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
        <h2 className="BuildingImagesTitle">Add Sketch</h2>
        <form id="uploadForm" onSubmit={(e) => handleSubmit(e, "addAnother")}>
          <div className="form-columns">
            {/* Left Column */}
            <div className="form-column">
              <div className="InputGroup">
                <label htmlFor="architect_id">Architect Name</label>
                <select
                  id="architect_id"
                  value={architect_id}
                  onChange={(e) => setArchitectId(e.target.value)}
                  required
                >
                  <option value="">Select Architect</option>
                  {architects.map((architect) => (
                    <option key={architect._id} value={architect._id}>
                      {architect.architect_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="InputGroup">
                <label htmlFor="description">Sketch Description</label>
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
                <label htmlFor="image_url">Sketch URL</label>
                <input
                  type="url"
                  id="image_url"
                  value={image_url}
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
                <button
                  type="submit"
                  className="BuildingImagesBtn"
                >
                  Add Another Sketch
                </button>
                <button
                  type="button"
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

export default ArchCollections;