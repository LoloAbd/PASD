import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "./BuildingImages.css";

const BuildingImages = () => {
  const [buildings, setBuildings] = useState([]);
  const [building_id, setBuildingId] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch buildings data when component mounts
  useEffect(() => {
    axios
      .get("http://localhost:3001/get-buildings")
      .then((res) => {
        setBuildings(res.data);
      })
      .catch((err) => {
        console.error("Error fetching buildings:", err);
      });
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file and return the image ID
  const fileUploadHandler = async () => {
    if (!file) {
      throw new Error("No file selected.");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:3001/add-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.file && response.data.file.id) {
        return response.data.file.id;
      } else {
        throw new Error("File upload failed.");
      }
    } catch (error) {
      throw error;
    }
  };

const handleAddAnother = async (e) => {
    e.preventDefault();

    if (!file) {
        alert("Please upload an image.");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("building_id", building_id);
        formData.append("description", description);

        const response = await axios.post("http://localhost:3001/add-images", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        alert("Image added successfully!");
        setDescription("");
        setBuildingId("");
        setFile(null);
    } catch (error) {
        alert(`Failed to add image. ${error.response?.data?.error || error.message}`);
    }
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
        formData.append("file", file);
        formData.append("building_id", building_id);
        formData.append("description", description);

        const response = await axios.post("http://localhost:3001/add-images", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

      alert("Image added successfully!");
      navigate('/');
    } catch (error) {
        alert(`Failed to add image. ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="BuildingImagesWrapper">
      <div className="BuildingImagesBox">
        <h2 className="BuildingImagesTitle">Add Images</h2>
        <form id="uploadForm" onSubmit={handleAddAnother}>
          <label htmlFor="building_id">Building Name</label>
          <div className="InputGroup">
            <select
              id="building_id"
              name="building_id"
              value={building_id}
              onChange={(e) => setBuildingId(e.target.value)}
              required
            >
              <option>Select Building</option>
              {buildings.map((building) => (
                <option key={building._id} value={building._id}>
                  {building.building_name}
                </option>
              ))}
            </select>
            <PiBuildingApartmentFill className="IconWrapper" />
          </div>

          <div className="InputGroup">
            <label htmlFor="description">Image Description</label>
            <textarea
              id="description"
              value={description}
              name="description"
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
            Add Another Image
          </button>
        </form>
        <button onClick={handleSubmit} className="BuildingImagesBtn">
          Submit
        </button>
      </div>
    </div>
  );
};

export default BuildingImages;
