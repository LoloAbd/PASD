import React, { useState, useEffect } from "react";
import axios from "axios";


const Architect = () => {
    const [architects, setArchitects] = useState([]);

    useEffect(() => {
    axios.get("http://localhost:3001/Architects")
      .then((res) => {setArchitects(res.data); // Save the fetched data in the state
      })
      .catch((err) => {console.error("Error fetching Architects:", err);});
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Architects</h1>
      <div style={styles.cardContainer}>
        {architects.map((architect) => (
          <div key={architect._id} style={styles.card}>
            <img
                src={architect.architect_image}
                alt={architect.architect_name}
                style={styles.image}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200'; }} // Placeholder image
                />

            <h2 style={styles.architect_name}>{architect.architect_name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '20px',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    textAlign: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  name: {
    fontSize: '1.5rem',
    marginTop: '10px',
  },
};

export default Architect;
