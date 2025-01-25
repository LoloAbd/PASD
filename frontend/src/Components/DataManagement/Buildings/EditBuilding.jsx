import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditBuilding = () => {
  const [building, setBuilding] = useState({
    building_name: '',
    area: '',
    numberOfFloors: '',
    en_description: '',
    ar_description: '',
    dateOfConstruction: '',
    documentationDate: ''
  });

  const { id } = useParams(); // Extract the building ID from the URL
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the building data based on the ID
    const fetchBuilding = async () => {
      try {
        const response = await fetch(`http://localhost:3001/buildings/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch building');
        }
        const data = await response.json();
        setBuilding(data); // Update the state with the fetched data
      } catch (error) {
        alert('Failed to fetch building data. Please try again later.');
      }
    };

    fetchBuilding();
  }, [id]); // Re-fetch when the `id` changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuilding((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/update-buildings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(building)
      });
      if (response.ok) {
        alert('Building updated successfully!');
        navigate('/ShowBuildings'); // Redirect to buildings list
      } else {
        throw new Error('Failed to update building');
      }
    } catch (error) {
      console.error('Error updating building:', error);
      alert('Failed to update building. Please try again.');
    }
  };

  const Back = () => {
    navigate('/ShowBuildings'); // Navigate back to the buildings list
  };

  return (
    <div className="add-building-container">
      <h1 className="add_Buildings_h">Edit Building</h1>
      <form className="add-building-form" onSubmit={handleSubmit}>
        <div className="form-boxes">

          <div className="form-box">
            <label className="add-building-label">Building Name</label>
            <div className="form-group">
              <input
                type="text"
                name="building_name"
                value={building.building_name}
                onChange={handleChange}
                required
              />
            </div>

            <label className="add-building-label">Area (in square meters)</label>
            <div className="form-group">
              <input
                type="number"
                name="area"
                value={building.area}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <label className="add-building-label">Number of Floors</label>
            <div className="form-group">
              <input
                type="number"
                name="numberOfFloors"
                value={building.numberOfFloors}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <label className="add-building-label">Building Description in English</label>
            <div className="form-group">
              <textarea
                name="en_description"
                value={building.en_description}
                onChange={handleChange}
                required
              />
            </div>

          </div>
          
          <div className="form-box">
            <label className="add-building-label">Building Description in Arabic</label>
            <div className="form-group">
              <textarea
                name="ar_description"
                value={building.ar_description}
                onChange={handleChange}
                required
              />
            </div>

            <label className="add-building-label">Date of Construction</label>
            <div className="form-group">
              <input
                type="number"
                name="dateOfConstruction"
                value={building.dateOfConstruction}
                onChange={handleChange}
                min="1900"
                required
              />
            </div>

            <label className="add-building-label">Documentation Date</label>
            <div className="form-group">
              <input
                type="number"
                name="documentationDate"
                value={building.documentationDate}
                onChange={handleChange}
                min="2022"
                required
              />
            </div>

          <button type="submit" className="submit-button">
            Update Building
          </button>
          <button
            type="button"
            className="submit-button"
            style={{ marginLeft: '20px' }}
            onClick={Back}
          >
            Back to Buildings
          </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default EditBuilding;