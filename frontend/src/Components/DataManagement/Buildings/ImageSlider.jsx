import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ImageSlider.css'; // Import the CSS file

const ImageSlider = () => {
    const [images, setImages] = useState([]);
    const [buildings, setBuildings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch images and buildings concurrently
        const fetchData = async () => {
            try {
                const [imagesRes, buildingsRes] = await Promise.all([
                    axios.get('http://localhost:3001/images'),
                    axios.get('http://localhost:3001/get-buildings'),
                ]);

                setImages(imagesRes.data);

                // Convert buildings array into a dictionary
                const buildingsMap = buildingsRes.data.reduce((acc, building) => {
                    acc[building._id] = building.building_name;
                    return acc;
                }, {});
                setBuildings(buildingsMap);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Group images by building
    const imagesByBuilding = images.reduce((acc, image) => {
        const buildingName = buildings[image.building_id] || 'Unknown Building';
        if (!acc[buildingName]) {
            acc[buildingName] = [];
        }
        acc[buildingName].push(image);
        return acc;
    }, {});

    return (
        <div className="slider">
            <h1>Buildings and Their Images</h1>
            {Object.keys(imagesByBuilding).map((buildingName) => (
                <div className="building-section" key={buildingName}>
                    <h2>{buildingName}</h2>
                    <div className="building-images">
                        {imagesByBuilding[buildingName].map((image) => (
                            <div className="image-container" key={image._id}>
                                <img
                                    src={`http://localhost:3001/files/${image.filename}`}
                                    alt={image.description}
                                    className="building-image"
                                    style={{ width: "600px", height: "350px" }}
                                />
                                <div className="image-description">{image.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageSlider;