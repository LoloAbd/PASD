import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegTrashAlt } from "react-icons/fa";
import "./ImageSlider.css";

const ImageSlider = () => {
  const [images, setImages] = useState([]);
  const [buildings, setBuildings] = useState({});
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imagesRes, buildingsRes] = await Promise.all([
          axios.get("http://localhost:3001/images"),
          axios.get("http://localhost:3001/get-buildings"),
        ]);

        setImages(imagesRes.data);

        const buildingsMap = buildingsRes.data.reduce((acc, building) => {
          acc[building._id] = building.building_name;
          return acc;
        }, {});
        setBuildings(buildingsMap);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteImage = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/delete-image/${id}`);
      const imagesRes = await axios.get("http://localhost:3001/images");
      setImages(imagesRes.data);

      alert("Image deleted successfully");
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredImages = images.filter((img) => img.building_id === selectedBuilding);

  return (
    <div className="slider">
      <h1>Buildings and Their Images</h1>

      <div className="dropdown-container">
        <select
          className="dropdown"
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
        >
          <option value="">Select a Building</option>
          {Object.entries(buildings).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {filteredImages.length === 0 ? (
        <div className="no-image">No images available for the selected building.</div>
      ) : (
        <div className="building-images">
          {filteredImages.map((image) => (
            <div className="image-container" key={image._id}>
              <img
                src={image.filename}
                alt={image.description}
                className="building-image"
                style={{ width: "600px", height: "350px" }}
              />
              <div className="image-description">
                {image.description}
                <br />
                Type: {image.Type}
              </div>
              <button
                className="delete"
                onClick={() => handleDeleteImage(image._id)}
              >
                <FaRegTrashAlt />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;