import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logAction from '../../logAction';

const EditBuilding = () => {
  const [building, setBuilding] = useState({
    building_name: '',
    area: '',
    numberOfFloors: '',
    en_description: '',
    ar_description: '',
    dateOfConstruction: '',
    documentationDate: '',
    address_id: '', // Address ID from the building document
  });

  const [address, setAddress] = useState({
    street: '',
    coordinates: [], // Coordinates as an array [latitude, longitude]
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
        setBuilding(data); // Update the state with the fetched building data

        // Fetch the address data based on the address_id
        if (data.address_id) {
          const addressResponse = await fetch(`http://localhost:3001/addresses/${data.address_id}`);
          if (!addressResponse.ok) {
            throw new Error('Failed to fetch address');
          }
          const addressData = await addressResponse.json();
          setAddress({
            ...addressData,
            coordinates: addressData.coordinates.join(', '), // Convert array to string for display
          });
        }
      } catch (error) {
        alert('Failed to fetch building or address data. Please try again later.');
      }
    };

    fetchBuilding();
  }, [id]); // Re-fetch when the `id` changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuilding((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCoordinatesChange = (e) => {
    const { value } = e.target;
    // Convert the input string to an array of numbers
    const coordinatesArray = value
      .split(',')
      .map((coord) => parseFloat(coord.trim()))
      .filter((coord) => !isNaN(coord)); // Remove invalid values

    // If both coordinates are valid, update the state
    if (coordinatesArray.length === 2) {
      setAddress((prevState) => ({
        ...prevState,
        coordinates: coordinatesArray, // Store as an array of numbers
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure coordinates are valid before updating
      const updatedAddress = {
        ...address,
        coordinates: address.coordinates.length === 2 ? address.coordinates : undefined, // Only send if valid
      };

      // Update the building details
      const buildingResponse = await fetch(`http://localhost:3001/update-buildings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(building),
      });

      if (!buildingResponse.ok) {
        throw new Error('Failed to update building');
      }

      // Update the address details
      if (building.address_id) {
        const addressResponse = await fetch(`http://localhost:3001/update-addresses/${building.address_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedAddress), // Send updated address with coordinates if valid
        });

        if (!addressResponse.ok) {
          throw new Error('Failed to update address');
        }
      }

      alert('Building and address updated successfully!');
      logAction("Edit Building", building.building_name);
      navigate('/ShowBuildings'); // Redirect to buildings list
    } catch (error) {
      console.error('Error updating building or address:', error);
      alert('Failed to update building or address. Please try again.');
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

            <label className="add-building-label">Building Description in Arabic</label>
            <div className="form-group">
              <textarea
                name="ar_description"
                value={building.ar_description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-box">
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

            {/* Address Fields */}
            <label className="add-building-label">Street</label>
            <div className="form-group">
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                required
              />
            </div>

            <label className="add-building-label">Coordinates</label>
            <div className="form-group">
              <input
                type="text"
                name="coordinates"
                value={Array.isArray(address.coordinates) ? address.coordinates.join(', ') : address.coordinates}
                onChange={handleCoordinatesChange}
                placeholder="latitude, longitude"
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
