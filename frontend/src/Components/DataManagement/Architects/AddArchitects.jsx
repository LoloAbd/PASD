import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logAction from '../../logAction'

const AddArchitects = () => {
  const [architect_name, setArchitectName] = useState("");
  const [ar_biography, setAr_biography] = useState("");
  const [en_biography, setEn_biography] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();


   const Back = () => {
    navigate('/Architects');
  }

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
      formData.append("ar_biography", ar_biography); // biography of the architect
       formData.append("en_biography", en_biography);

      const response = await axios.post("http://localhost:3001/add-architect", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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

          <button type="submit" className="submit-button" style={{marginLeft : "15px"}}>Add Architect</button>
          <button className="submit-button " style={{marginLeft : "20px"}} onClick={Back} > Back to Architects </button>
        </form>
      </div>
    </div>
   </div>
  );
};

export default AddArchitects;
