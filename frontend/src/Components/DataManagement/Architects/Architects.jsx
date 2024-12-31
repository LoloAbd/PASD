import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GoPersonFill } from "react-icons/go";
import './DataPage.css'

const Architects = () => {
   const navigate = useNavigate();
  const [architects, setArchitects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [buildings, setBuildings] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedArchitect, setSelectedArchitect] = useState(null);
  const [addArchitect, setAddArchitect] = useState("");
  const [architect_name, setArchitectName] = useState("");
  const [architect_image, setFile] = useState("");
  const [en_biography, seten_biography] = useState("");
  const [ar_biography, setar_biography] = useState("");
  
  const Back = () => {
        navigate('/')
    }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result); // Set Base64 string
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // Make the API call to add a new architect
    axios.post('http://localhost:3001/add-architect', { architect_name, architect_image, en_biography, ar_biography })
      .then((res) => {
        console.log(res);
        alert("Architect added successfully");
        setAddArchitect(false);
      })
      .catch((err) => {
        console.error("Error adding architect:", err);
        alert("Failed to add architect");
      });
    
    
    axios.get("http://localhost:3001/architects") // Adjust URL if needed
      .then((res) => {
        setArchitects(res.data);
      })
      .catch((err) => {
        console.error("Error fetching architects:", err);
      });
  };

  // Fetch architects on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3001/architects") // Adjust URL if needed
      .then((res) => {
        setArchitects(res.data);
      })
      .catch((err) => {
        console.error("Error fetching architects:", err);
      });
  }, []);

  const handleSort = (columnName) => {
    const direction =
      sortConfig.key === columnName && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnName, direction });

    const sortedData = [...architects].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setArchitects(sortedData);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (id) => {
    const newName = prompt("Enter new name:");
    if (newName) {
      axios
        .put(`http://localhost:3001/architects/${id}`, { name: newName })
        .then(() => {
          alert("Architect updated successfully");
          setArchitects((prev) =>
            prev.map((architect) =>
              architect._id === id ? { ...architect, name: newName } : architect
            )
          );
        })
        .catch((err) => {
          console.error("Error updating architect:", err);
          alert("Failed to update architect");
        });
    }
  };

  const handleBuildingSearch = (id) => {
    setBuildings([]);
    setSelectedArchitect(architects.find((architect) => architect._id === id));

    axios
      .get(`http://localhost:3001/architects/${id}/buildings`)
      .then((res) => {
        setBuildings(res.data); // Assuming res.data contains building details
        setFormVisible(true);
      })
      .catch((err) => {
        console.error("Error fetching buildings:", err);
        alert("Failed to fetch buildings.");
      });
  };

  const filteredArchitects = architects.filter((architect) =>
    Object.values(architect)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArchitects = filteredArchitects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  if (addArchitect) {
    return (
      <div className='AddAdminHome'>
        <div className="AddAdminWrapper" style={{height: "630px"}}>
          <div className="AddAdminFormBox">
            <h2 className="AddAdminTitle">Add New Architect</h2>
            <form onSubmit={handleSubmit}>
              <div className="AddAdminInputBox">
                <input type="text" name="architectName" onChange={(e) => setArchitectName(e.target.value)} required
                />
                <label>Architect Name</label>
                <GoPersonFill className='icon' />
              </div>

              <label className="add-building-label">Architect Image</label>
              <div className="form-group">
                <input type="file" accept=".png, .jpg, .jpeg, .svg"  name="architect_image" onChange={handleFileChange} />
                </div>
              
              <label className="add-building-label" >Arabic Biography</label>
              <div className="form-group">
                <textarea name="ar_biography" onChange={(e) => setar_biography(e.target.value)}/>
              </div>
              
              <label className="add-building-label" >English Biography</label>
              <div className="form-group">
                <textarea name="en_biography" onChange={(e) => seten_biography(e.target.value)}/>
              </div>
              <button type="submit" className="AddAdminBtn">Add Architect</button>
            </form>
            <button className="AddAdminBtn" style={{width: "100px"}} onClick={Back}>Home</button>
          </div>
          
        </div>
      </div>
    );
  } else if (!addArchitect) {
    return (
      <div className="table-container">
        {formVisible ? (
          <>
            <h1>Buildings Related to Architect: {selectedArchitect?.architect_name}</h1>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>
                    <AiOutlineFieldNumber />
                  </th>
                  <th>
                    Building Name <BiSortAlt2 />
                  </th>
                </tr>
              </thead>
              <tbody>
                {buildings.length > 0 ? (
                  buildings.map((building, index) => (
                    <tr key={building.building_id}>
                      <td>{index + 1}</td>
                      <td>{building.building_name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No buildings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button className="submit-button" onClick={() => setFormVisible(false)}> Back to Architects </button>
          </>
        ) : (
          <>
            <h1>Architects</h1>
            <div className="controls">
              <input type="text" className="form-control search-bar" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
              <button className="btn btn-primary add-button" onClick={() => { setAddArchitect(true); }}> <FaPlus /></button>
            </div>
            <table className="custom-table" style={{ width: "1000px" }}>
              <thead>
                <tr>
                  <th>
                    <AiOutlineFieldNumber />
                  </th>
                  <th onClick={() => handleSort("architect_name")}>
                    Architect Name <BiSortAlt2 />
                    </th>
                    <th>Architect Image</th>
                    <th onClick={() => handleSort("en_biography")}>
                    English Biography <BiSortAlt2 />
                    </th>
                    <th onClick={() => handleSort("ar_biography")}>
                    Arabic Biography <BiSortAlt2 />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentArchitects.length > 0 ? (
                  currentArchitects.map((architect, index) => (
                    <tr key={architect._id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{architect.architect_name}</td>
                      <td><img src={architect.architect_image} style={{ width: "50px", height: "50px" }} /> </td>
                      <td>{architect.en_biography}</td>
                      <td>{architect.ar_biography}</td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(architect._id)}
                        >
                          <FaEdit />
                        </button>
                        <button className="view-button" onClick={() => handleBuildingSearch(architect._id)}> <FaEye /> View Buildings</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No architects found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(filteredArchitects.length / itemsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    className={`page-button ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </>
        )}
        <button className="AddAdminBtn" style={{width: "100px"}} onClick={Back}>Home</button>
      </div>
    );
  }
};

export default Architects;
