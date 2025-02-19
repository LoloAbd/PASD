import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegTrashAlt } from "react-icons/fa";
import "./ArchImageSlider.css";

const SketchSlider = () => {
  const [sketches, setSketches] = useState([]);
  const [architects, setArchitects] = useState({});
  const [selectedArchitect, setSelectedArchitect] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sketchesRes, architectsRes] = await Promise.all([
          axios.get("http://localhost:3001/sketches"),
          axios.get("http://localhost:3001/Architects"),
          
        ]);

        setSketches(sketchesRes.data);

        const architectsMap = architectsRes.data.reduce((acc, architect) => {
          acc[architect._id] = architect.architect_name;
          return acc;
          
        }, {});
        setArchitects(architectsMap);
        console.log(architectsRes)
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteSketch = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this sketch?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/delete-sketch/${id}`);
      const sketchesRes = await axios.get("http://localhost:3001/sketches");
      setSketches(sketchesRes.data);

      alert("Sketch deleted successfully");
    } catch (err) {
      console.error("Error deleting sketch:", err);
      alert("Failed to delete sketch");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredSketches = sketches.filter(
    (sketch) => sketch.architect_id._id === selectedArchitect
  );

  return (
    <div className="slider">
      <h1>Architects and Their Sketches</h1>

      <div className="dropdown-container">
        <select
          className="dropdown"
          value={selectedArchitect}
          onChange={(e) => setSelectedArchitect(e.target.value)}
        >
          <option value="">Select an Architect</option>
          {Object.entries(architects).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {filteredSketches.length === 0 ? (
        <div className="no-image">No sketches available for the selected architect.</div>
      ) : (
        <div className="sketch-gallery">
          {filteredSketches.map((sketch) => (
            <div className="sketch-container" key={sketch._id}>
              <img
                src={sketch.image_url}
                alt={sketch.description}
                className="sketch-image"
                style={{ width: "600px", height: "350px" }}
              />
              <div className="sketch-description">
                {sketch.description}
              </div>
              <button
                className="delete"
                onClick={() => handleDeleteSketch(sketch._id)}
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

export default SketchSlider;