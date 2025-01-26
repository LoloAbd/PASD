import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logAction from '../../logAction';

const AddArchitects = () => {
  const [architect_name, setArchitectName] = useState("");
  const [ar_biography, setAr_biography] = useState("");
  const [en_biography, setEn_biography] = useState("");
  const [filename, setFilename] = useState(""); // State for the image URL
  const navigate = useNavigate();

  const Back = () => {
    navigate('/Architects');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object with the form data
    const formData = {
      architect_name,
      ar_biography,
      en_biography,
      filename, // Image URL
    };

    try {
      // Send the form data as JSON
      const response = await axios.post("http://localhost:3001/add-architect", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Architect added successfully!");
      logAction("Add Architect", architect_name);
      navigate('/Architects');
    } catch (error) {
      alert(`Failed to add architect. ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="AddAdminHome">
      <div className="AddAdminWrapper">
        <div className="AddAdminFormBox">
          <h2 className="AddAdminTitle">Add Architect</h2>
          <form id="uploadForm" onSubmit={handleSubmit}>
            <div className="AddAdminInputBox">
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

            <div className="AddAdminInputBox">
              <label htmlFor="ar_biography">Arabic Biography</label>
              <textarea
                id="ar_biography"
                value={ar_biography}
                name="ar_biography"
                onChange={(e) => setAr_biography(e.target.value)}
              />
            </div>

            <div className="AddAdminInputBox">
              <label htmlFor="en_biography">English Biography</label>
              <textarea
                id="en_biography"
                value={en_biography}
                name="en_biography"
                onChange={(e) => setEn_biography(e.target.value)}
              />
            </div>

            <div className="AddAdminInputBox">
              <label htmlFor="filename">Image URL</label>
              <input
                type="text"
                id="filename"
                name="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-button" style={{ marginLeft: "15px" }}>Add Architect</button>
            <button type="button" className="submit-button" style={{ marginLeft: "20px" }} onClick={Back}>Back to Architects</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddArchitects;