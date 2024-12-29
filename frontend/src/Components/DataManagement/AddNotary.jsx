import React, { useState } from 'react';
import axios from 'axios';
import { GoPersonFill } from "react-icons/go";

const AddNotary = () => {
    const [notary_name, setNotary_name] = useState("");
    const [formVisible, setFormVisible] = useState(true);
    

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make the API call to add a new notary
    axios.post('http://localhost:3001/add-notary', { notary_name })
      .then((res) => {
        console.log(res);
          alert("Notary added successfully");
          setFormVisible(false);
          
      })
      .catch((err) => {
        console.error("Error adding notary:", err);
        alert("Failed to add notary");
      });
  };

  return (
    <div className='AddAdminHome'>
      <div className="AddAdminWrapper">
        <div className="AddAdminFormBox">
          <h2 className="AddAdminTitle">Add New Notary</h2>
          <form onSubmit={handleSubmit}>
            <div className="AddAdminInputBox">
              <input
                type="text"
                name="notary_name"
                onChange={(e) => setNotary_name(e.target.value)}
                required
              />
              <label>Notary Name</label>
              <GoPersonFill className='icon' />
            </div>
            <button type="submit" className="AddAdminBtn">Add Notary</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNotary;
