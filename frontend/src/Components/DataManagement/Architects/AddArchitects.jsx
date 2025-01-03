import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddArchitects = () => {
  const [architect_name, setArchitectName] = useState("");
  const [biography, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle final form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file); // file to upload
      formData.append("architect_name", architect_name); // name of the architect
      formData.append("biography", biography); // biography of the architect

      const response = await axios.post("http://localhost:3001/add-architect", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Architect added successfully!");
      navigate('/Architects');
    } catch (error) {
      alert(`Failed to add architect. ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="BuildingImagesWrapper">
      <div className="BuildingImagesBox">
        <h2 className="BuildingImagesTitle">Add Architect</h2>
        <form id="uploadForm" onSubmit={handleSubmit}>
          <div className="InputGroup">
            <label htmlFor="architect_name">Architect Name</label>
            <input
              type="text"
              id="architect_name"
              name="architect_name"
              value={architect_name}
              onChange={(e) => setArchitectName(e.target.value)}
              required
            />
          </div>

          <div className="InputGroup">
            <label htmlFor="biography">Biography</label>
            <textarea
              id="biography"
              value={biography}
              name="biography"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="InputGroup">
            <label htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="fileInput"
              name="file"
              accept=".png, .jpg, .jpeg"
              onChange={handleFileChange}
              ref={fileInputRef}
              required
            />
          </div>

          <button type="submit" className="BuildingImagesBtn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddArchitects;
